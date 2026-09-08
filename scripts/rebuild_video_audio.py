import urllib.request
import urllib.parse
import subprocess
import os
import json

TEMP_DIR = "/tmp/audio_sync"
os.makedirs(TEMP_DIR, exist_ok=True)

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

def build_video_1():
    print("=== Processing Video 1: Data Structures and Types (67s) ===")
    clips_data = [
        {
            "id": "v1_s1",
            "text": "Data means raw facts and information, such as numbers, characters, words, or symbols.",
            "start": 0.4,
            "window": 10.0,
            "speed": 1.0
        },
        {
            "id": "v1_s2",
            "text": "When data is organized properly, it becomes easier to access, manage, search, and process.",
            "start": 10.4,
            "window": 10.0,
            "speed": 1.0
        },
        {
            "id": "v1_s3",
            "text": "Data structures are ways of organizing and storing data, so that we can use it efficiently.",
            "start": 20.4,
            "window": 9.0,
            "speed": 1.0
        },
        {
            "id": "v1_s4",
            "text": "Data structures can be broadly classified into Primitive and Non-Primitive data structures.",
            "start": 29.4,
            "window": 8.0,
            "speed": 1.0
        },
        {
            "id": "v1_s5",
            "text": "Primitive data structures are basic data types that directly store simple values: Integer, Float, Character, and Boolean.",
            "start": 37.3,
            "window": 10.0,
            "speed": 1.06
        },
        {
            "id": "v1_s6",
            "text": "Non-primitive data structures organize multiple values, including arrays, linked lists, stacks, queues, trees, and graphs.",
            "start": 47.3,
            "window": 10.0,
            "speed": 1.15
        },
        {
            "id": "v1_s7",
            "text": "Data structures organize data efficiently and can be classified into different types based on how they store and connect information.",
            "start": 57.3,
            "window": 10.0,
            "speed": 1.0
        }
    ]

    total_duration = 67.0
    processed_clips = []

    for item in clips_data:
        raw_mp3 = os.path.join(TEMP_DIR, f"{item['id']}_raw.mp3")
        fetch_tts(item["text"], raw_mp3)
        processed_wav = os.path.join(TEMP_DIR, f"{item['id']}_proc.wav")

        speed_filter = f"atempo={item['speed']}," if item['speed'] != 1.0 else ""
        af = f"{speed_filter}afade=t=in:ss=0:d=0.04,afade=t=out:st=100:d=0.04"
        cmd = ["ffmpeg", "-y", "-i", raw_mp3, "-filter:a", af, "-ar", "44100", "-ac", "2", processed_wav]
        subprocess.run(cmd, check=True, stderr=subprocess.DEVNULL)
        clip_dur = get_duration(processed_wav)
        end_time = item["start"] + clip_dur
        print(f"[{item['id']}] start={item['start']}s dur={clip_dur:.2f}s end={end_time:.2f}s (window={item['window']}s)")
        processed_clips.append((item["start"], processed_wav))

    inputs = []
    filter_parts = []
    for idx, (start_sec, wav_path) in enumerate(processed_clips):
        inputs.extend(["-i", wav_path])
        delay_ms = int(start_sec * 1000)
        filter_parts.append(f"[{idx}]adelay={delay_ms}|{delay_ms}[a{idx}]")

    mix_inputs = "".join([f"[a{idx}]" for idx in range(len(processed_clips))])
    filter_parts.append(f"{mix_inputs}amix=inputs={len(processed_clips)}:dropout_transition=0:normalize=0[voice]")

    ambient_filter = f"aevalsrc=0.005*sin(2*PI*220*t)+0.003*sin(2*PI*330*t)+0.002*sin(2*PI*440*t):s=44100:d={total_duration}[amb]"
    filter_parts.append(ambient_filter)
    filter_parts.append("[voice][amb]amix=inputs=2:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=7[outa]")

    full_filter = ";".join(filter_parts)
    final_audio = os.path.join(TEMP_DIR, "v1_audio.wav")

    mix_cmd = ["ffmpeg", "-y"] + inputs + ["-filter_complex", full_filter, "-map", "[outa]", "-t", str(total_duration), final_audio]
    subprocess.run(mix_cmd, check=True, stderr=subprocess.DEVNULL)
    print("Video 1 master audio rendered:", get_duration(final_audio))

    input_video = "src/Videos/Data Structures and Types.mp4"
    output_video = os.path.join(TEMP_DIR, "v1_synced.mp4")

    merge_cmd = [
        "ffmpeg", "-y",
        "-i", input_video,
        "-i", final_audio,
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-shortest",
        output_video
    ]
    subprocess.run(merge_cmd, check=True, stderr=subprocess.DEVNULL)
    print("Video 1 output duration:", get_duration(output_video))

    subprocess.run(["mv", output_video, input_video], check=True)
    print("Updated:", input_video)

def build_video_2():
    print("=== Processing Video 2: Linear and Non-Linear Data Structures (24s) ===")
    clips_data = [
        {
            "id": "v2_s1",
            "text": "Choosing the right data structure helps a program store, access, and process data more effectively.",
            "start": 0.1,
            "window": 6.0,
            "speed": 1.25
        },
        {
            "id": "v2_s2",
            "text": "Linear data structures arrange elements in a sequential order: Arrays, Linked Lists, Stacks, and Queues.",
            "start": 6.3,
            "window": 10.0,
            "speed": 1.0
        },
        {
            "id": "v2_s3",
            "text": "Non-linear data structures do not follow a single sequential order. Trees and graphs are common examples.",
            "start": 16.2,
            "window": 8.0,
            "speed": 1.05
        }
    ]

    total_duration = 24.0
    processed_clips = []

    for item in clips_data:
        raw_mp3 = os.path.join(TEMP_DIR, f"{item['id']}_raw.mp3")
        fetch_tts(item["text"], raw_mp3)
        processed_wav = os.path.join(TEMP_DIR, f"{item['id']}_proc.wav")

        speed_filter = f"atempo={item['speed']}," if item['speed'] != 1.0 else ""
        af = f"{speed_filter}afade=t=in:ss=0:d=0.04,afade=t=out:st=100:d=0.04"
        cmd = ["ffmpeg", "-y", "-i", raw_mp3, "-filter:a", af, "-ar", "44100", "-ac", "2", processed_wav]
        subprocess.run(cmd, check=True, stderr=subprocess.DEVNULL)
        clip_dur = get_duration(processed_wav)
        end_time = item["start"] + clip_dur
        print(f"[{item['id']}] start={item['start']}s dur={clip_dur:.2f}s end={end_time:.2f}s (window={item['window']}s)")
        processed_clips.append((item["start"], processed_wav))

    inputs = []
    filter_parts = []
    for idx, (start_sec, wav_path) in enumerate(processed_clips):
        inputs.extend(["-i", wav_path])
        delay_ms = int(start_sec * 1000)
        filter_parts.append(f"[{idx}]adelay={delay_ms}|{delay_ms}[a{idx}]")

    mix_inputs = "".join([f"[a{idx}]" for idx in range(len(processed_clips))])
    filter_parts.append(f"{mix_inputs}amix=inputs={len(processed_clips)}:dropout_transition=0:normalize=0[voice]")

    ambient_filter = f"aevalsrc=0.005*sin(2*PI*220*t)+0.003*sin(2*PI*330*t)+0.002*sin(2*PI*440*t):s=44100:d={total_duration}[amb]"
    filter_parts.append(ambient_filter)
    filter_parts.append("[voice][amb]amix=inputs=2:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=7[outa]")

    full_filter = ";".join(filter_parts)
    final_audio = os.path.join(TEMP_DIR, "v2_audio.wav")

    mix_cmd = ["ffmpeg", "-y"] + inputs + ["-filter_complex", full_filter, "-map", "[outa]", "-t", str(total_duration), final_audio]
    subprocess.run(mix_cmd, check=True, stderr=subprocess.DEVNULL)
    print("Video 2 master audio rendered:", get_duration(final_audio))

    input_video = "src/Videos/Linear and Non-Linear Data Structures.mp4"
    output_video = os.path.join(TEMP_DIR, "v2_synced.mp4")

    merge_cmd = [
        "ffmpeg", "-y",
        "-i", input_video,
        "-i", final_audio,
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-shortest",
        output_video
    ]
    subprocess.run(merge_cmd, check=True, stderr=subprocess.DEVNULL)
    print("Video 2 output duration:", get_duration(output_video))

    subprocess.run(["mv", output_video, input_video], check=True)
    print("Updated:", input_video)

if __name__ == "__main__":
    build_video_1()
    build_video_2()
    print("All videos updated successfully with studio-grade synced audio!")
