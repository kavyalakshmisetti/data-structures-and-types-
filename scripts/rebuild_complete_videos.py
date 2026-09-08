import os
import subprocess
import urllib.request
import urllib.parse
import json

TEMP_DIR = "/tmp/audio_sync"
SLIDES_DIR = "/tmp/video_slides"
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(SLIDES_DIR, exist_ok=True)
os.makedirs("src/Videos", exist_ok=True)
os.makedirs("public/Videos", exist_ok=True)

def step1_generate_slides():
    print("=== Step 1: Rendering slides with strict bounding box protection ===")
    subprocess.run(["python3", "scripts/generate_video_slides.py"], check=True)

def fetch_tts(text: str, out_path: str):
    url = "https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=" + urllib.parse.quote(text)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req) as resp, open(out_path, "wb") as f:
        f.write(resp.read())

def get_duration(file_path: str) -> float:
    res = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", file_path],
        capture_output=True, text=True, check=True
    )
    return float(json.loads(res.stdout)["format"]["duration"])

def build_video(video_id: str, title: str, slides_config, clips_config, output_filename):
    print(f"\n=== Building {title} ({output_filename}) ===")
    
    # 1. Encode Video Stream from slides with subtle animated camera pan/zoom
    segment_files = []
    for idx, (img_name, dur) in enumerate(slides_config):
        seg_mp4 = os.path.join(TEMP_DIR, f"{video_id}_seg_{idx}.mp4")
        fps = 24
        frames = int(dur * fps)
        
        # We apply an animated zoompan filter for subtle dynamic motion
        cmd_seg = [
            "ffmpeg", "-y", "-loop", "1", "-i", os.path.join(SLIDES_DIR, img_name),
            "-filter_complex", f"zoompan=z='min(zoom+0.0002,1.025)':d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720",
            "-t", str(dur), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(fps),
            seg_mp4
        ]
        subprocess.run(cmd_seg, check=True, stderr=subprocess.DEVNULL)
        segment_files.append(seg_mp4)

    concat_list = os.path.join(TEMP_DIR, f"{video_id}_seg_concat.txt")
    with open(concat_list, "w") as f:
        for seg in segment_files:
            f.write(f"file '{seg}'\n")

    raw_video = os.path.join(TEMP_DIR, f"{video_id}_raw.mp4")
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", raw_video], check=True, stderr=subprocess.DEVNULL)
    total_dur = get_duration(raw_video)
    print(f"{video_id} raw video stream created. Total Duration: {total_dur:.2f}s")

    # 2. Build Audio Stream
    processed_audio_clips = []
    for clip in clips_config:
        cid = clip["id"]
        raw_tts = os.path.join(TEMP_DIR, f"{cid}_raw.mp3")
        fetch_tts(clip["text"], raw_tts)
        
        orig_d = get_duration(raw_tts)
        speed = clip.get("speed", 1.0)
        target_d = orig_d / speed
        
        # Time-stretched audio
        speed_mp3 = os.path.join(TEMP_DIR, f"{cid}_speed.mp3")
        subprocess.run([
            "ffmpeg", "-y", "-i", raw_tts,
            "-filter:a", f"atempo={speed},volume=1.0",
            "-c:a", "libmp3lame", "-q:a", "2",
            speed_mp3
        ], check=True, stderr=subprocess.DEVNULL)
        
        # Envelope & fade out
        faded_wav = os.path.join(TEMP_DIR, f"{cid}_faded.wav")
        subprocess.run([
            "ffmpeg", "-y", "-i", speed_mp3,
            "-filter:a", f"afade=t=in:ss=0:d=0.08,afade=t=out:st={max(0, target_d - 0.12)}:d=0.12",
            "-c:a", "pcm_s16le", faded_wav
        ], check=True, stderr=subprocess.DEVNULL)
        
        actual_d = get_duration(faded_wav)
        start_ms = int(clip["start"] * 1000)
        processed_audio_clips.append({
            "wav": faded_wav,
            "start_ms": start_ms,
            "duration": actual_d
        })

    # Merge narration voice track
    voice_track = os.path.join(TEMP_DIR, f"{video_id}_voice.wav")
    inputs = []
    filter_parts = []
    for idx, c in enumerate(processed_audio_clips):
        inputs.extend(["-i", c["wav"]])
        filter_parts.append(f"[{idx}]adelay={c['start_ms']}|{c['start_ms']}[d{idx}]")
    
    delayed_labels = "".join([f"[d{i}]" for i in range(len(processed_audio_clips))])
    filter_parts.append(f"{delayed_labels}amix=inputs={len(processed_audio_clips)}:duration=longest:normalize=0[voice_out]")
    
    cmd_voice = ["ffmpeg", "-y"] + inputs + ["-filter_complex", ";".join(filter_parts), "-map", "[voice_out]", "-c:a", "pcm_s16le", voice_track]
    subprocess.run(cmd_voice, check=True, stderr=subprocess.DEVNULL)
    
    # 3. Ambient Synth Bed (identical harmonic chord progression)
    ambient_wav = os.path.join(TEMP_DIR, f"{video_id}_ambient.wav")
    ambient_filter = (
        f"sine=frequency=110:duration={total_dur}[s1];"
        f"sine=frequency=164.81:duration={total_dur}[s2];"
        f"sine=frequency=220:duration={total_dur}[s3];"
        f"[s1][s2][s3]amix=inputs=3:duration=first:normalize=0[amb_raw];"
        f"[amb_raw]lowpass=f=360,volume=0.045,afade=t=in:ss=0:d=1.5,afade=t=out:st={total_dur - 2.0}:d=2.0[amb_out]"
    )
    subprocess.run(["ffmpeg", "-y", "-filter_complex", ambient_filter, "-map", "[amb_out]", "-c:a", "pcm_s16le", ambient_wav], check=True, stderr=subprocess.DEVNULL)

    # 4. Final Audio Master with loudnorm broadcast normalization
    master_audio = os.path.join(TEMP_DIR, f"{video_id}_master.wav")
    subprocess.run([
        "ffmpeg", "-y",
        "-i", voice_track,
        "-i", ambient_wav,
        "-filter_complex", "[0:a]volume=1.0[v];[1:a]volume=0.85[a];[v][a]amix=inputs=2:duration=first:normalize=0[mixed];[mixed]loudnorm=I=-16:TP=-1.5:LRA=11[norm]",
        "-map", "[norm]",
        "-c:a", "pcm_s16le",
        master_audio
    ], check=True, stderr=subprocess.DEVNULL)

    # 5. Multiplex Final Master Video
    out_public = os.path.join("public/Videos", output_filename)
    out_src = os.path.join("src/Videos", output_filename)
    
    cmd_final = [
        "ffmpeg", "-y",
        "-i", raw_video,
        "-i", master_audio,
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        out_public
    ]
    subprocess.run(cmd_final, check=True, stderr=subprocess.DEVNULL)
    
    # Also copy to src/Videos
    subprocess.run(["cp", out_public, out_src], check=True)
    print(f"SUCCESS: Exported {output_filename} ({get_duration(out_public):.2f}s)")

def main():
    step1_generate_slides()
    
    # ─── VIDEO 1 CONFIGURATION (67s) ───
    v1_slides = [
        ("v1_s1.png", 10.0),
        ("v1_s2.png", 10.0),
        ("v1_s3.png", 9.0),
        ("v1_s4.png", 8.0),
        ("v1_s5.png", 10.0),
        ("v1_s6.png", 10.0),
        ("v1_s7.png", 10.0),
    ]
    v1_clips = [
        {"id": "v1_s1", "text": "Data means raw facts and information, such as numbers, characters, words, or symbols.", "start": 0.4, "speed": 1.0},
        {"id": "v1_s2", "text": "When data is organized properly, it becomes easier to access, manage, search, and process.", "start": 10.4, "speed": 1.0},
        {"id": "v1_s3", "text": "Data structures are ways of organizing and storing data, so that we can use it efficiently.", "start": 20.4, "speed": 1.0},
        {"id": "v1_s4", "text": "Data structures can be broadly classified into Primitive and Non-Primitive data structures.", "start": 29.4, "speed": 1.0},
        {"id": "v1_s5", "text": "Primitive data structures are basic data types that directly store simple values: Integer, Float, Character, and Boolean.", "start": 37.3, "speed": 1.06},
        {"id": "v1_s6", "text": "Non-primitive data structures are created using primitive types to store multiple or complex values: Arrays, Lists, and Files.", "start": 47.3, "speed": 1.06},
        {"id": "v1_s7", "text": "Data structures organize data efficiently and can be classified into different types based on how they store and connect information.", "start": 57.3, "speed": 1.05},
    ]
    build_video("v1", "Video 1: Data Structures and Types", v1_slides, v1_clips, "Data Structures and Types.mp4")

    # ─── VIDEO 2 CONFIGURATION (70s) ───
    v2_slides = [
        ("v2_s1.png", 9.0),
        ("v2_s2.png", 10.0),
        ("v2_s3.png", 10.0),
        ("v2_s4.png", 10.0),
        ("v2_s5.png", 10.0),
        ("v2_s6.png", 10.0),
        ("v2_s7.png", 11.0),
    ]
    v2_clips = [
        {"id": "v2_s1", "text": "Choosing the right data structure helps a program store, access, and process data more effectively.", "start": 0.4, "speed": 1.0},
        {"id": "v2_s2", "text": "Arrays store elements in contiguous memory blocks, granting instant O(1) index access with expensive insertion.", "start": 9.4, "speed": 1.05},
        {"id": "v2_s3", "text": "Linked lists store elements in separate memory nodes linked by pointers, providing dynamic resizing and fast O(1) head insertion.", "start": 19.4, "speed": 1.05},
        {"id": "v2_s4", "text": "Stacks operate on Last-In, First-Out order: elements push and pop strictly from the top with instant O(1) time.", "start": 29.4, "speed": 1.05},
        {"id": "v2_s5", "text": "Queues operate on First-In, First-Out order: items enter at the rear and exit from the front, ideal for process scheduling.", "start": 39.4, "speed": 1.05},
        {"id": "v2_s6", "text": "Trees organize data hierarchically into root, parent, and child nodes; Binary Search Trees allow blazing O(log N) search.", "start": 49.4, "speed": 1.05},
        {"id": "v2_s7", "text": "Choose Arrays for fast indexed lookup, Linked Lists for flexible inserts, Stacks and Queues for sequential order, and Trees for hierarchical search.", "start": 59.4, "speed": 1.05},
    ]
    build_video("v2", "Video 2: Linear and Non-Linear Data Structures", v2_slides, v2_clips, "Linear and Non-Linear Data Structures.mp4")
    print("\nAll videos built and deployed to both public/Videos/ and src/Videos/!")

if __name__ == "__main__":
    main()
