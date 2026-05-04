# Lighthouse Analysis: lexica.fri3dl.dev

**Analysis Date:** May 4, 2026
**Target URL:** `https://lexica.fri3dl.dev`
**Tool:** Google Lighthouse (Headless Chrome)

## Overview

Overall, the site has an **excellent Performance Score (98/100)**. Core web vitals are well within the "Good" thresholds. However, Lighthouse highlighted a few minor performance bottlenecks and some more significant issues in **Accessibility** and **SEO**.

### Lighthouse Scores
* **Performance:** 🟢 98
* **Best Practices:** 🟢 100
* **SEO:** 🟠 73
* **Accessibility:** 🟠 60

---

## 🚀 Performance Issues

While scoring very high, the following areas offer room for optimization:

1. **Render-Blocking CSS (~300ms delay)**
   * **Issue:** The main Nuxt CSS file (`_nuxt/entry.*.css`, ~27 KB) blocks the initial render of the page. This delays the First Contentful Paint (FCP) and Largest Contentful Paint (LCP).
   * **Recommendation:** Configure Nuxt to inline critical CSS and defer the rest via the `nuxt.config.ts`.

2. **Unused JavaScript (~49 KiB wasted)**
   * **Issue:** The JS chunk `_nuxt/9ZwoLNCH.js` (approx. 100 KB) has almost 50% unused code during the initial page load.
   * **Recommendation:** Implement lazy loading for components that are not immediately visible (e.g., using Vue's `<LazyComponentName />`). Check if large third-party libraries can be better tree-shaken.

3. **Back/Forward Cache (bfcache) Failures**
   * **Issue:** The page prevents restoration from the back/forward cache due to an internal eviction event.
   * **Recommendation:** Investigate event listeners (like `unload`) or specific Nuxt plugins that might be preventing the browser from caching the page state when navigating away.

---

## ⚠️ Accessibility Issues (Score: 60)

This is the most critical area for improvement. Lighthouse flagged multiple missing accessibility features:

* **Missing Accessible Names:** Icon-only buttons or interactive elements lack `aria-label`s.
* **Color Contrast:** Some background and foreground color combinations do not meet the minimum contrast ratio.
* **Missing Form Labels:** Form elements (`<input>`, `<textarea>`, etc.) do not have associated `<label>` tags.
* **Missing HTML Language:** The `<html>` element does not have a `lang` attribute (e.g., `lang="en"` or `lang="de"`).

---

## 🔍 SEO Issues (Score: 73)

Basic SEO metadata is missing from the document head:

* **Missing Document Title:** The site lacks a `<title>` element.
* **Missing Meta Description:** No `<meta name="description" content="...">` tag is present.
* **Invalid `robots.txt`:** The `robots.txt` file has 1 error and is considered invalid.

> [!TIP]
> Most of the SEO and `lang` attribute issues can be quickly fixed by updating the `app.head` configuration inside `nuxt.config.ts` or by using Nuxt's `useHead()` composable in `app.vue`.

---

## 🏗️ Architectural & Hosting Flaws (Vercel)

Looking at the codebase (`nuxt.config.ts`, `app.vue`, `package.json`, and the Nuxt modules), there are several critical architectural flaws that will cause issues, especially when deploying to Vercel:

### 1. Vector Embeddings inside Serverless Functions (Size Limit)
* **Issue:** The `modules/embeddings.ts` script generates dense vector embeddings for all Markdown files and saves them to a JSON file (`server/assets/embeddings.json`). Nitro bundles this file into the Vercel Serverless Function. Vercel has a strict **50MB limit** for serverless functions.
* **Why it's bad:** JSON is highly inefficient for storing vector arrays (e.g., `[0.1245, -0.9812, ...]`). As your notes grow, this file will quickly bloat past Vercel's limits, breaking your deployments.
* **Fix:** Use a dedicated vector database (like Pinecone, Qdrant, or Supabase pgvector) instead of bundling embeddings as JSON inside the serverless function.

### 2. Build-Time AI Embedding Generation
* **Issue:** The embeddings are generated at build time (`nuxt.hook("build:before")`) using `@xenova/transformers`, which downloads a model from HuggingFace.
* **Why it's bad:** Vercel builds have strict memory and time limits. Running an AI model during the build step will spike memory usage and drastically slow down deployments. Furthermore, Vercel clears non-standard caches between builds, so the model will likely be re-downloaded every time.
* **Fix:** Move embedding generation to a separate pipeline (e.g., GitHub Actions) or only generate embeddings when content actually changes, storing them in an external database.

### 3. Native `better-sqlite3` Dependency
* **Issue:** `better-sqlite3` is listed in your `dependencies`. 
* **Why it's bad:** It requires native C++ compilation during `npm install`. This frequently causes build failures or warnings on Vercel. More importantly, Vercel's filesystem is read-only and serverless functions are ephemeral, so you **cannot** use SQLite as a persistent database on Vercel.
* **Fix:** Remove `better-sqlite3` if it's not strictly needed, or migrate to a cloud database (like Turso, Neon, or Cloudflare D1) if you need SQL capabilities.

### 4. Client-Side Performance (`app.vue` scroll polling)
* **Issue:** In `app.vue`, there is a `setInterval` running every **100ms** to check `window.scrollY` and calculate scroll speed.
* **Why it's bad:** Continuously polling the DOM every 100ms forces the browser to keep the JavaScript thread active, which hurts performance (especially on mobile) and drains battery life.
* **Fix:** Since you already have `@vueuse/nuxt` installed, you should use the `useWindowScroll()` composable to reactively and efficiently track scroll position instead of polling.
