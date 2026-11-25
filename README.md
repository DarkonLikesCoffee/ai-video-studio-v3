# AI Video Studio

A Remotion-based video studio. Videos are authored as code-first compositions in `src/compositions/<slug>/`, with shared components in `src/shared/`.

## Reference sets

User reference sets live in `reference/<name>/` and contain up to 6 JPG or PNG frames plus a `notes.md` describing what to borrow and ignore.
Keep frames at 1280 px wide max (ideally under 800 KB each); the existing images directly in `reference/` remain the default 3D references.
For videos, use evenly spaced extracted frames rather than committing video files.

## Uploading user reference sets

Create an issue titled `Reference set: <name>` and attach JPG, PNG, WebP, MP4, MOV, or WebM files. The issue author must be the repository owner. The workflow downloads the attachments, prepares up to six frames (images resized to 1280 px wide max; videos sampled at evenly spaced timestamps), and opens a pull request adding `reference/<name>/`.

Add optional notes as plain lines in the issue body:

- `TAKE: ...` — visual qualities to borrow.
- `IGNORE: ...` — elements to avoid.
- `MOTION: ...` — camera movement and pacing.
- `FRAME 1: ...` — factual description of the first prepared frame; repeat for each frame.

The workflow does not generate AI image descriptions. If a FRAME description is omitted, notes.md explicitly marks it for inspection. Review the pull request and merge it to make the set available.

## npm scripts

- `npm run check` — run the TypeScript check.
- `npm run still -- <id> <frames>` — render selected frames.
- `npm run sheet -- <id>` — create a contact sheet.
- `npm run render -- <id>` — render the composition to MP4.

## Review branches and commit metadata

Create each task branch from `main` using the name `review/<slug>`. Push ordinary work commits to the review branch; the review workflow runs only when the commit message contains render metadata:

`composition=<id> frames=<comma-separated-frames> round=<n> final=<true|false>`

The metadata identifies the composition and frames to inspect, the review round, and whether to render a final MP4. Commits without `composition=` skip the review-render job. Once the work is approved, merge the review branch into `main` through a pull request.
