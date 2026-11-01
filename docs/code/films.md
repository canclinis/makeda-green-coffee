# Films

Still images are done. This is the remaining media work. Two files, no player library and no second set of renditions.

## Hero

`static/video/hero.mp4` is the homepage film in `src/lib/home/Hero.svelte`.

Measured from the file: H.264, 1920×818, 25 fps, no audio, 61 seconds, 9.1 MB (about 1.2 Mbps). The page autoplays it muted, inline, and looped. The poster is `static/images/hero-poster.webp` (19 KB, same pixel size). A comment in `Hero.svelte` scales the video to 1.02 because some frames have a 1px black row on the top and bottom.

Mobile PageSpeed on 1 Nov 2026 scored the homepage 75, with LCP at 6.6 s. The LCP element was this film. The lab transfer was about 10.3 MB, and this file was about 9.3 MB of that. The poster can paint first. Autoplay still pulls the mp4 into the first load.

The width is close to the slot. The length is the weight. A quality or resolution pass on the full 61 seconds will not make it small. Shortening it is a content cut: ask before trimming.

Done when all of these are true:

- The homepage first paint does not wait on `hero.mp4`. The poster is the LCP image.
- The film still autoplays muted, inline, and loops, and the poster stays up until it plays.
- The 1.02 scale stays until a re-encode shows the black rows are gone.
- No streaming setup, no `srcset` of videos, no new player component.

## Contact film

`static/video/coffee_pill_women.mp4` plays on `/contact` through `ContactFilm.svelte`.

Measured from the file: H.264 plus AAC, 720×720, 28 seconds, 4.1 MB. `preload="metadata"`, so the homepage does not download it. The poster is `static/images/contact-film-poster.webp` (131 KB). The component fades the sound out when the visitor leaves the page.

Do this after the hero. Done when the film still plays with sound from the start of the clip, and the file is no heavier than a 720 square of that length needs to be.

## Already true

Both `<video>` elements have no captions track, and `svelte-check` warns. The hero file has no audio track. The contact file does. Captions are a separate accessibility change, not this performance task.
