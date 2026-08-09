'use client';

import { useStoryReveal, useStoryScroll } from '@/lib/story-scroll';

/* Mount point for the scroll engine. Renders nothing — it exists so the page
   itself can stay a server component while still owning one, and only one,
   scroll frame. */
export function StoryEngine() {
  useStoryScroll();
  useStoryReveal();
  return null;
}

export default StoryEngine;
