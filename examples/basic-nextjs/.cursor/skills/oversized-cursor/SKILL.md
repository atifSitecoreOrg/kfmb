---
name: oversized-cursor
description: Homepage-only oversized cursor accent. Use when polishing the KFMB home page. Do not apply it sitewide.
---

# Oversized cursor

The accent lives in `src/components/uiim/motion/OversizedCursor.tsx` and is mounted from `src/Layout.tsx` only when the route name is Home.

Rules:

- Show it only for a fine pointer. Touch devices keep the native cursor.
- Do nothing when `prefers-reduced-motion: reduce` matches.
- The cursor is decorative: `aria-hidden`, no pointer events, and it must not cover buttons in a way that blocks clicks.
- Ease the follow with a short ease-out transform. Do not add a trail, click burst, or custom cursor on product, recipe, news, or event pages.
