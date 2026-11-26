#!/usr/bin/env python3
"""Generate Kokoro narration WAV and word timings for AI Video Studio v3."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import urllib.request
from pathlib import Path
from typing import Any

MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx"
VOICES_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin"
MODEL_NAME = "kokoro-v1.0.onnx"
VOICES_NAME = "voices-v1.0.bin"
MODEL_SHA256 = "beb0d1848dee9a49da392cc3df26958d46cfa35d321edf434f52949153f0df3a"
VOICES_SHA256 = "bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d"

VOICE_LANGUAGES = {
    "es": {"ef_dora", "em_alex", "em_santa"},
    "en-us": {"af_heart", "af_sarah"},
}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def download_once(url: str, destination: Path, expected_sha256: str) -> None:
    if destination.is_file() and sha256_file(destination) == expected_sha256:
        return
    destination.unlink(missing_ok=True)
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(destination.suffix + ".part")
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "AI-Video-Studio/1.0"})
        with urllib.request.urlopen(request, timeout=60) as response, temporary.open("wb") as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
        actual_sha256 = sha256_file(temporary)
        if actual_sha256 != expected_sha256:
            raise RuntimeError(
                f"SHA-256 mismatch for {destination.name}: expected {expected_sha256}, got {actual_sha256}"
            )
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)


def map_words(kokoro: Any, text: str, language: str, timings: list[Any]) -> list[dict[str, Any]]:
    """Align isolated written-word phonemes to the sentence-level timed stream.

    eSpeak can change phoneme spellings/counts with sentence context, so a
    character-for-character allocation is not reliable. Use a global edit
    alignment, retain the model's actual timings, and reject poor alignments
    rather than fabricating subtitle positions.
    """
    words = re.findall(r"\S+", text)
    timed_phonemes = [item for item in timings if not str(item.phoneme).isspace()]
    if not words or not timed_phonemes:
        raise RuntimeError("Kokoro did not return usable word timing data.")

    expected: list[str] = []
    expected_word: list[int] = []
    for word_index, word in enumerate(words):
        phonemes = kokoro.tokenizer.phonemize(word, language)
        characters = [character for character in phonemes if not character.isspace()]
        if not characters:
            raise RuntimeError(f"Kokoro produced no phonemes for written word {word!r}.")
        expected.extend(characters)
        expected_word.extend([word_index] * len(characters))

    actual = [str(item.phoneme) for item in timed_phonemes]
    n, m = len(expected), len(actual)
    # Needleman-Wunsch / Levenshtein alignment. A substitution, insertion,
    # or deletion costs one; exact phoneme matches cost zero.
    costs = [[0] * (m + 1) for _ in range(n + 1)]
    moves = [bytearray(m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        costs[i][0] = i
        moves[i][0] = 1  # expected phoneme absent from timed stream
    for j in range(1, m + 1):
        costs[0][j] = j
        moves[0][j] = 2  # timed phoneme absent from isolated-word stream

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            diagonal = costs[i - 1][j - 1] + (expected[i - 1] != actual[j - 1])
            deletion = costs[i - 1][j] + 1
            insertion = costs[i][j - 1] + 1
            best = min(diagonal, deletion, insertion)
            costs[i][j] = best
            moves[i][j] = 0 if diagonal == best else (1 if deletion == best else 2)

    distance = costs[n][m]
    error_ratio = distance / max(n, m)
    if error_ratio > 0.18:
        raise RuntimeError(
            "Kokoro's sentence pronunciation differs too much from isolated-word "
            f"phonemization to align safely ({n} expected, {m} timed phonemes, "
            f"{distance} edits; {error_ratio:.1%} mismatch). "
            "No subtitle timings were guessed."
        )

    actual_word: list[int | None] = [None] * m
    i, j = n, m
    while i or j:
        move = moves[i][j]
        if i and j and move == 0:
            actual_word[j - 1] = expected_word[i - 1]
            i -= 1
            j -= 1
        elif i and (j == 0 or move == 1):
            i -= 1
        else:
            j -= 1

    # Assign inserted sentence-context phonemes to the nearest aligned word.
    previous_position: list[int | None] = [None] * m
    following_position: list[int | None] = [None] * m
    last_position: int | None = None
    for index, word_index in enumerate(actual_word):
        if word_index is not None:
            last_position = index
        previous_position[index] = last_position
    last_position = None
    for index in range(m - 1, -1, -1):
        if actual_word[index] is not None:
            last_position = index
        following_position[index] = last_position
    for index, word_index in enumerate(actual_word):
        if word_index is None:
            before_position = previous_position[index]
            after_position = following_position[index]
            if before_position is None and after_position is None:
                raise RuntimeError("Kokoro's phoneme alignment contains no usable word anchors.")
            if before_position is None:
                actual_word[index] = actual_word[after_position]
            elif after_position is None:
                actual_word[index] = actual_word[before_position]
            elif index - before_position <= after_position - index:
                actual_word[index] = actual_word[before_position]
            else:
                actual_word[index] = actual_word[after_position]

    aligned: list[dict[str, Any]] = []
    for word_index, word in enumerate(words):
        word_timings = [
            timed_phonemes[index] for index, mapped_word in enumerate(actual_word)
            if mapped_word == word_index
        ]
        if not word_timings:
            raise RuntimeError(
                f"Kokoro's phoneme alignment could not locate written word {word!r}; "
                "refusing to invent its subtitle timing."
            )
        start = min(float(item.start) for item in word_timings)
        end = max(float(item.end) for item in word_timings)
        if start < 0 or end <= start:
            raise RuntimeError(f"Kokoro returned an invalid time span for word {word!r}.")
        aligned.append({
            "index": word_index,
            "text": word,
            "startSeconds": round(start, 4),
            "endSeconds": round(end, 4),
        })
    return aligned

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--project-dir", required=True, type=Path)
    parser.add_argument("--model-dir", required=True, type=Path)
    args = parser.parse_args()

    config = json.loads(args.config.read_text(encoding="utf-8"))
    if not isinstance(config, dict) or config.get("schemaVersion") != 1:
        raise ValueError("Narration config must be a JSON object with schemaVersion: 1.")

    text = config.get("text")
    language = config.get("language", "es")
    speed = config.get("speed", 1.0)
    voice = config.get("voice", "ef_dora" if language == "es" else "af_heart")
    if not isinstance(text, str) or not text.strip() or len(text) > 6000:
        raise ValueError("text must contain 1-6000 characters.")
    if language not in VOICE_LANGUAGES:
        raise ValueError("language must be 'es' or 'en-us' for this initial provider adapter.")
    if voice not in VOICE_LANGUAGES[language]:
        raise ValueError(f"voice {voice!r} is not an approved {language} voice.")
    if isinstance(speed, bool) or not isinstance(speed, (int, float)) or not 0.5 <= speed <= 1.5:
        raise ValueError("speed must be a number between 0.5 and 1.5.")

    model_dir = args.model_dir.expanduser().resolve()
    model_path = model_dir / MODEL_NAME
    voices_path = model_dir / VOICES_NAME
    download_once(MODEL_URL, model_path, MODEL_SHA256)
    download_once(VOICES_URL, voices_path, VOICES_SHA256)

    try:
        import soundfile as sf
        from kokoro_onnx import Kokoro
    except ImportError as error:
        raise RuntimeError(
            "Narration dependencies are missing. Install requirements-tts.txt first."
        ) from error

    kokoro = Kokoro(str(model_path), str(voices_path))
    if voice not in kokoro.voices:
        raise RuntimeError(f"Voice {voice!r} is not present in the downloaded Kokoro voice pack.")
    if not kokoro.has_timings:
        raise RuntimeError(
            "The selected Kokoro model does not expose phoneme durations; "
            "refusing to invent subtitle timings."
        )

    audio, sample_rate, phoneme_timings = kokoro.create_timed(
        text.strip(),
        voice=voice,
        speed=float(speed),
        lang=language,
        continuous=True,
    )
    words = map_words(kokoro, text.strip(), language, phoneme_timings)
    duration_seconds = len(audio) / sample_rate
    if not duration_seconds > 0:
        raise RuntimeError("Kokoro generated an empty narration track.")
    if words[-1]["endSeconds"] > duration_seconds + 0.05:
        raise RuntimeError("Kokoro's final word timing extends beyond the generated audio.")

    audio_path = args.project_dir / "public" / "audio" / "narration.wav"
    alignment_path = args.project_dir / "src" / "generated" / "narration-alignment.ts"
    audio_path.parent.mkdir(parents=True, exist_ok=True)
    alignment_path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(audio_path, audio, sample_rate, subtype="PCM_16")

    result = {
        "schemaVersion": 1,
        "engine": "kokoro-onnx",
        "model": MODEL_NAME,
        "language": language,
        "voice": voice,
        "speed": float(speed),
        "sampleRate": int(sample_rate),
        "durationSeconds": round(duration_seconds, 4),
        "text": text.strip(),
        "words": words,
    }
    intervals: list[dict[str, float]] = []
    for word in words:
        start = float(word["startSeconds"])
        end = float(word["endSeconds"])
        if intervals and start - intervals[-1]["endSeconds"] <= 0.18:
            intervals[-1]["endSeconds"] = round(max(intervals[-1]["endSeconds"], end), 4)
        else:
            intervals.append({"startSeconds": round(start, 4), "endSeconds": round(end, 4)})

    alignment_source = (
        "// Generated by scripts/generate-narration.py. Do not edit by hand.\n"
        f"export const narrationWords = {json.dumps(words, ensure_ascii=False, indent=2)} as const;\n\n"
        f"export const speechIntervals = {json.dumps(intervals, ensure_ascii=False, indent=2)} as const;\n"
    )
    alignment_path.write_text(alignment_source, encoding="utf-8")
    print(
        f"Generated {duration_seconds:.2f}s narration ({len(words)} aligned words) "
        f"with {voice} [{language}]."
    )
    print(f"Audio: {audio_path}")
    print(f"Alignment: {alignment_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"Narration generation failed: {error}", file=sys.stderr)
        raise SystemExit(1)
