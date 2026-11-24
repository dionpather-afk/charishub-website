/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
export {};

declare global {
  interface ImportMetaEnv {
    /** "off" hides the site from search engines (indexing is on by default). */
    readonly SITE_INDEXING?: string;
  }
}

