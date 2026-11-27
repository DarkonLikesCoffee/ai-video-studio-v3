# AI Video Studio

A Remotion-based video studio. Videos are authored as code-first compositions in `src/compositions/<slug>/`, with shared components in `src/shared/`.

## Reference sets

User reference sets live in `reference/<name>/` and contain up to 6 JPG or PNG frames plus a `notes.md` describing what to borrow and ignore.
Keep frames at 1280 px wide max (ideally under 800 KB each); the existing images directly in `reference/` remain the default 3D references.
For videos, use evenly spaced extracted frames rather than committing video files.

## Uploading user reference sets

Create an issue titled `Reference set: <name>` and attach JPG, PNG, WebP, MP4, MOV, or WebM files. The issue author must be the repository owner. The workflow downloads the attachments, prepares up to six frames (images resized to 1280 px wide max; videos sampled at evenly spaced timestamps), verifies the committed images by reading them back from `main`, and commits `reference/<name>/` directly to `main`. Original videos are never committed.

Add optional notes as plain lines in the issue body:

- `TAKE: ...` — visual qualities to borrow.
- `IGNORE: ...` — elements to avoid.
- `MOTION: ...` — camera movement and pacing.
- `FRAME 1: ...` — factual description of the first prepared frame; repeat for each frame.

The workflow does not generate AI image descriptions. If a FRAME description is omitted, notes.md explicitly marks it for inspection. The set is available as soon as the workflow succeeds; the issue receives a link to the commit.

## npm scripts

- `npm run check` — run the TypeScript check.
- `npm run still -- <id> <frames>` — render selected frames.
- `npm run sheet -- <id>` — create a contact sheet.
- `npm run render -- <id>` — render the composition to MP4.

## Review branches and commit metadata

Create each task branch from `main` using the name `review/<slug>`. Push ordinary work commits to the review branch; the review workflow runs only when the commit message contains render metadata:

`composition=<id> frames=<comma-separated-frames> round=<n> final=<true|false>`

The metadata identifies the composition and frames to inspect, the review round, and whether to render a final MP4. Commits without `composition=` skip the review-render job. Once the work is approved, merge the review branch into `main` through a pull request.

## Audio and narration

Compositions can use the shared `AudioSystem` from `src/shared/audio/AudioSystem.tsx`.
It supports narration, music with timing-based ducking, and independently scheduled sound-effect cues with per-cue and bus volume.

To enable generated narration for a review render:

1. Copy `production/narration.example.json` to `production/narration.json`.
2. Replace the example text and choose a supported language/voice.
3. Push the change to a `review/**` branch. The review workflow downloads/caches
   Kokoro ONNX model files, generates `public/audio/narration.wav`, and writes
   word/speech timing data to `src/generated/narration-alignment.ts` before Remotion renders. Final review MP4s are loudness-mastered to -16 LUFS / -1.5 dBTP and checked for both audio and video streams.
4. The generated WAV is ignored by Git; the final rendered MP4 contains the audio.

Supported initial settings: Spanish (`es`: `ef_dora`, `em_alex`, `em_santa`)
and US English (`en-us`: `af_heart`, `af_sarah`). Speed must be between 0.5 and 1.5.

For local generation, install `requirements-tts.txt` and run:

```bash
python scripts/generate-narration.py --config production/narration.json --project-dir . --model-dir ~/.cache/ai-video-studio/kokoro-v1.0
```



### DawnBalloon sound-design experiment

DawnBalloon now uses a separate SFX bus. Its cue manifest is generated from the visible balloon lift, scene transitions, and cloth movement. The review workflow installs [Earshot](https://github.com/Leonxlnx/earshot) and deterministically renders the selected designs on the CPU; WAVs are build artifacts rather than committed binaries. Each transient is placed using Earshot's measured peak offset so the audible peak, not merely the file start, lands on the intended event. The existing Kokoro narration and ambient music remain separate and unchanged.

Review artifacts for DawnBalloon include the generated WAV cues and their resolved timing manifest alongside the mastered MP4.
