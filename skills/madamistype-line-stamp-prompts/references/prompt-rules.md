# Prompt Rules

## Goal

Generate prompts for NanoBanana that produce LINE sticker-ready character art with exact visible text already rendered in the image.

## Base Rules

Always enforce these rules:

- one character only
- anime-style or game-ready character illustration
- cute sticker-like polish
- exact requested text appears in the image
- no extra text
- no logo
- no watermark
- comfortable margin for later fitting into the final canvas

## Text Rules

The text is part of the image, not a later overlay.

Always instruct NanoBanana to:

- render the exact provided text
- avoid misspelling, omission, or extra characters
- use cute rounded sticker lettering
- avoid plain default font styling
- make the lettering feel custom illustrated rather than typeset
- keep the text thick and readable
- keep strong contrast between fill and outline
- keep the text fully visible inside the frame
- keep text-related quality control in the main prompt instead of the negative prompt

## Transparency Rules

The repo does not trust model-native transparency.

Always instruct NanoBanana to:

- use a perfectly uniform bright green background `#00FF00`
- avoid green on the character
- avoid green in the text fill, outline, or decoration
- keep a crisp boundary between foreground and background
- avoid background shadows, gradients, and clutter

## Role Rules

### `main`

- package-cover feel
- readable at `240x240`
- may use a stronger emotional pose

### `tab`

- readable at `96x74`
- very short text only
- face or upper-body framing is acceptable

### `stamp`

- reaction should read instantly
- text must not collide with the character
- keep the silhouette and lettering sticker-friendly
- vary the body action aggressively across stamps when `poseDirection` is provided

## Negative Constraints

Keep these near the end of the prompt or in `negativePrompt`.

Do not put text-suppression terms such as `文字`, `text`, `letters`, or `typography` into `negativePrompt`.
For LINE stamps, NanoBanana is expected to render the requested text and lettering design inside the image, so all text requirements stay on the positive-prompt side.

Recommended `negativePrompt` items:

- multiple characters
- cropped head or feet
- speech bubbles unless explicitly requested
- logo
- watermark
- background clutter
- green clothing
- green props
