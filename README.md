# Nature’s Hush site

Public landing, privacy, sound-source, and support pages for Nature’s Hush.

- Home: `https://georgexu123.github.io/`
- Privacy: `https://georgexu123.github.io/privacy.html`
- Sound Sources & Credits: `https://georgexu123.github.io/sources.html`
- Support: `https://georgexu123.github.io/support.html`

This repository contains only the public website. It does not contain the app source code.

`sound-sources-data.js` is generated from the private app repository’s 72-item iOS release catalog. Regenerate it from that repository with:

```bash
python3 scripts/generate_public_sound_sources.py
```

The public data contains only user-visible titles, creators, sources, licenses, and attributions. It does not publish audio files or private app source.
