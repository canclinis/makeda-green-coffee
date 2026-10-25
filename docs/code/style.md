# How this repo writes code

**KISS.** The site is small. Prefer readable, changeable code over clever structure.

Look, color, type, and voice live in [`docs/brand/visual-language.md`](../brand/visual-language.md). This file is the code shape.

## Consistency first

Pages that do the same job use the same structure. A new section follows the stack and spacing already on the site (section title, body measure, burgundy frame, footer) unless the user asks for a different shape.

Before inventing a new layout, look for an existing section or design component that already does that job. Prefer mounting that over a fresh grid in the page file.

## Readability

Open a file and see each element with the properties that belong to it. That is the default. Where a property is written is under [Where a style lives](#where-a-style-lives).

- **Reusable components over CSS abstraction.** When the same arrangement repeats, extract a Svelte component in `src/lib/design` with the skeleton and CSS inside it. Props or snippets carry the variants. Prefer that over utility sheets, BEM layers, or a growing global stylesheet.
- **Abstract on reuse.** Extract when the same thing is used more than once (or clearly about to be). Leave a one-off local until a second call site appears. Over-abstraction — wrappers, helpers, and files with no second user — costs readability; skip it.
- **Keep files short.** Aim under **250 lines** per file. When a file grows past that because it holds distinct sections or compositions, split by real responsibility into components that stay readable on their own.

## Shared compositions

When the same arrangement of regions appears on more than one surface — or is about to — that arrangement is **one** component in `src/lib/design`.

- The component owns the skeleton and the CSS. Pages mount it; they do not re-implement the same grid.
- Differences are **props** or **snippets** (order of regions, what fills a slot, density, tone). One component, variants by prop.
- A slot that can hold different media (image, video, or other) is still one layout. The media type is an input, not a reason for a second component.

**Extract when** you can name the layout without naming the page (“copy beside media, either side first”). **Keep local when** it exists only once.

Existing chrome already follows this: `Button`, `IconButton`, `Text`, `SectionTitle`, `Modal`. New recurring layouts join that set.

## Where a style lives

The file that owns the markup owns the CSS. A reused composition lives in `src/lib/design`. A one-off stays in the page component. `design.css` is only the site-wide reset, type, tokens, and page width.

Inside that file, write each property in the first place that can express it:

1. **On the element** — one element's own properties, as a `style` attribute beside the tag.
2. **In `<style>`** — a state or variant (`:hover`, an ancestor class), or one rule shared by every element of that type. A class only when the same rule is reused on more than one element in the file.

## Body text lines up

Every block of body copy starts at the same distance under its section title. The section container carries that padding. Side-by-side regions use `align-items: start`, so one column does not sit in the vertical center while the other starts at the top.

## Accessibility, crawlers, CWV, and SEO

Every change that touches pages, media, or copy considers **accessibility**, **crawlers**, **CWV**, and **SEO**. People and bots should both be able to use the page from the HTML alone.

- **Crawlable document.** Important copy, links, and structure live in the HTML. Prefer real text and links over text locked in images or video-only content. Server-rendered routes stay readable without running client JS for the main content.
- **Semantics.** Real headings in order, landmarks (`nav`, `main`, `footer`, labelled regions), buttons and links that say what they do, `alt` on informative images (empty `alt` only when decorative). Keyboard can reach and operate interactive controls.
- **Titles and meta.** Each route has a clear `<title>`; keep names and topics that matter for search in the document.
- **Media.** Size and compress images and video for the slot they fill; set width/height (or aspect ratio) to limit layout shift; lazy-load below-the-fold media; keep the LCP candidate eager and unblocked.
- **Weight.** Ship the smallest assets and CSS that still match the brand. Extra fonts, scripts, and client work on first paint only when the feature needs them.
