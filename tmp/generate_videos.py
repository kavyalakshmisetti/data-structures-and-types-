import subprocess
import math
import sys
import os

def clamp(v, low, high):
    return max(low, min(high, v))

def lerp(a, b, t):
    return a + (b - a) * t

def ease_in_out(t):
    t = clamp(t, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

print("Utility functions verified.")
