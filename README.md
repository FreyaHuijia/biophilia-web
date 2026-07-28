# Biophilia

An immersive virtual gallery created for a Georgia Institute of Technology Catalyst Grant project.

## Project structure

- `index.html` — page content and script loading
- `styles.css` — all visual styles
- `gallery-data.js` — painting metadata and asset paths
- `gallery-3d.js` — Three.js scene, camera, controls, and animation
- `ui.js` — landing page, tour navigation, and painting panels
- `audio.js` — generated ambient soundscape
- `ascent.jpg` and `terrain.jpg` — painting image assets

## Preview locally

From this directory, run:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Publish with GitHub Pages

Push the repository to GitHub, then enable Pages in **Settings → Pages**, using the `main` branch and the repository root.
