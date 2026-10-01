# Guide branding

Every personale-guide loads two stylesheets after its own styles:

- `brand/<brand>/brand.css` (with `id="lc-brand"`): the brand tokens. Colours, font and labels. Nothing else.
- `guide-theme.css`: the shared look. It only reads the `--brand-*` tokens.

`guide-enhance.js` adds the brand bar and takes the logo from `logo.svg` in the same folder as the linked `brand.css`.

## Add a brand

1. Copy `brand/livecloud/` to `brand/<tenant>/`.
2. Change the values in `brand.css` and replace `logo.svg` (and `logo.png`).
3. Point `link#lc-brand` at the new folder.

## Planned (v2)

Take the tenant's logo and colours from FMS and set the brand per festival, instead of a fixed link in each page.
