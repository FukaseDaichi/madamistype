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
- keep the text thick and readable
- keep strong contrast between fill and outline
- keep the text fully visible inside the frame

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

## Negative Constraints

Keep these near the end of the prompt or in `negativePrompt`:

- multiple characters
- cropped head or feet
- missing text
- misspelled text
- extra text
- tiny unreadable text
- weak text contrast
- speech bubbles unless explicitly requested
- logo
- watermark
- background clutter
- green clothing
- green props
- green text
