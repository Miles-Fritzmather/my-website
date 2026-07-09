/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  output: "export",
  // Custom domain (milesfm.me) is served from the site root, not /repo-name/.
  basePath: "",
  images: {
    unoptimized: true,
  },
};

export default config;
