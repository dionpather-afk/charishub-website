/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
export {};

declare global {
  interface ImportMetaEnv {
    /** "on" lets search engines index the site (only after go-live approval). */
    readonly SITE_INDEXING?: string;
  }
}

