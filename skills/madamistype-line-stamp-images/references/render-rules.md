# Render Rules

## Goal

Turn a prompt manifest into final LINE sticker PNGs without changing the approved composition intent.

## Base Rules

- use the prompt from the manifest as-is
- preserve the exact requested text
- prefer the chibi reference image URL when available
- keep generation on a green background for local transparency removal
- fit the transparent result into the final delivery canvas with outer padding

## Text Rules

- the prompt-defined text must remain inside the generated image
- do not add local text overlays
- do not rewrite or shorten the text during image generation
- keep the text readable after final scaling

## Compositing Rules

- center the visible foreground inside the target canvas
- keep at least the requested padding when possible
- preserve transparency
- keep the final file under 1MB

## Validation Rules

Validate at least:

- exact canvas size
- even dimensions
- PNG format
- alpha presence
- 72dpi metadata
- file size
- safe outer padding
- low green fringe on visible pixels

OCR text validation is optional and may be skipped when the local environment does not provide OCR tooling.
