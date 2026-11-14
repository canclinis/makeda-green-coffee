# Films

Still images are done. This is the remaining media work. Two files, no player library and no second set of renditions.

## Hero

`static/video/hero.mp4` plays on the homepage through `Film` in `src/lib/home/Hero.svelte`.

Measured from the file: H.264 plus AAC, 1920×818, 25 fps, 61 seconds, 10 MB (about 1.4 Mbps). The soundtrack is the original 128 kb/s stereo track. The page autoplays it inline and looped, and turns the soundtrack on. If the browser blocks sound before any interaction, the picture keeps playing and the soundtrack starts on the first tap or keypress. The poster is `static/images/hero-poster.webp` (19 KB, same pixel size). A comment in `Hero.svelte` scales the video to 1.02 because some frames have a 1px black row on the top and bottom.

Mobile PageSpeed on 1 Nov 2026 scored the homepage 75, with LCP at 6.6 s. The LCP element was this film. The lab transfer was about 10.3 MB, and this file was about 9.3 MB of that. The poster can paint first. Autoplay still pulls the mp4 into the first load.

The width is close to the slot. The length is the weight. A quality or resolution pass on the full 61 seconds will not make it small. Shortening it is a content cut: ask before trimming.

Done when all of these are true:

- The homepage first paint does not wait on `hero.mp4`. The poster is the LCP image.
- The film still autoplays inline and loops. The soundtrack fades in, and the visitor can mute it. If the browser blocks sound before any interaction, the picture keeps playing and the soundtrack starts on the first tap or keypress. The poster stays up until it plays.
- The 1.02 scale stays until a re-encode shows the black rows are gone.
- No streaming setup and no `srcset` of videos. Films share `src/lib/design/Film.svelte`.

## Contact film

`static/video/coffee_pill_women.mp4` plays on `/contact` through `Film`.

Measured from the file: H.264 plus AAC, 720×720, 28 seconds, 4.1 MB. `preload="metadata"`, so the homepage does not download it. The poster is `static/images/contact-film-poster.webp` (131 KB). The soundtrack fades in, the visitor can mute it, and the sound fades out when the visitor leaves the page.

Do this after the hero. Done when the film still plays with sound from the start of the clip, and the file is no heavier than a 720 square of that length needs to be.

## Already true

Both films include a captions track so `svelte-check` is quiet. The track has no caption text yet. The hero file and the contact file both have audio. Writing the captions is a separate change.
