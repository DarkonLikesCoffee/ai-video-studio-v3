# AI Video Studio

A Remotion-based video studio. Videos are authored as code-first compositions in `src/compositions/<slug>/`, with shared components in `src/shared/`.

## npm scripts

- `npm run check` — run the TypeScript check.
- `npm run still -- <id> <frames>` — render selected frames.
- `npm run sheet -- <id>` — create a contact sheet.
- `npm run render -- <id>` — render the composition to MP4.

## Review branches and commit metadata

Create each task branch from `main` using the name `review/<slug>`. Push ordinary work commits to the review branch; the review workflow runs only when the commit message contains render metadata:

`composition=<id> frames=<comma-separated-frames> round=<n> final=<true|false>`

The metadata identifies the composition and frames to inspect, the review round, and whether to render a final MP4. Commits without `composition=` skip the review-render job. Once the work is approved, merge the review branch into `main` through a pull request.
