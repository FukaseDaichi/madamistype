# IO Schema

## Input Sources

Read the character identity from:

```text
data/types/*.json
```

Read the LINE sticker set definition from:

```text
data/line-stamps/*.json
```

## Required Sticker Set Fields

Each set JSON is expected to provide at least:

- `setId`
- `typeCode`
- `packageName`
- `locale`
- `style`
- `main.intent`
- `main.text`
- `main.textDesignPrompt`
- `tab.intent`
- `tab.text`
- `tab.textDesignPrompt`
- `stamps[]`
- `stamps[].id`
- `stamps[].text`
- `stamps[].intent`
- `stamps[].textDesignPrompt`

`textPlacement` is optional and will default by role.

## Output Root

Default output root:

```text
output/line-stamp-prompts/
```

## Output Layout

```text
output/line-stamp-prompts/
  batch-report.json
  ofei-daily-replies/
    manifest.json
    review.md
    main/
      prompt.txt
      negative_prompt.txt
      meta.json
    tab/
      prompt.txt
      negative_prompt.txt
      meta.json
    stamps/
      01/
        prompt.txt
        negative_prompt.txt
        spec.json
```

## Manifest Contract

The prompt skill must write a `manifest.json` that the image skill can consume directly.

Each asset entry must include:

- `role`
- `fileName`
- `text`
- `textDesignPrompt`
- `textPlacement`
- `canvas.width`
- `canvas.height`
- `paddingPx`
- `prompt`
- `negativePrompt`
- `renderTextInModel`
