// @ts-check
// Plain static website: `npm run build` writes finished HTML, CSS, JS and
// media into dist/, which is uploaded as-is to Xneelo (public_html).
// No Wix, no server code (apart from the small contact.php form mailer).
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// SITE_BASE lets the same code run in a sub-folder for the GitHub preview
// (e.g. /charishub-website/). On Xneelo it is the site root "/".
const base = process.env.SITE_BASE || "/";

export default defineConfig({
  output: "static",
  site: "https://www.rcacharisma.com",
  base,
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
  integrations: [tailwind(), react()],
  vite: {
    cacheDir: "node_modules/.cache/.vite",
  },
  devToolbar: {
    enabled: false,
  },
});
