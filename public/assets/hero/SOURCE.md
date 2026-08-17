# Hero footage

Top-down aerial of a road through autumn woodland, supplied by the client
(189819-887078801_medium.mp4). Original 2560x1440, 29.97fps, 19.35s, 32 MB,
with an audio track.

Chosen because it behaves like a background rather than a subject:

  - locked off, so nothing drifts under the type
  - movement is confined to the road band; the rest of the frame is static texture
  - already dark, in deep greens and ochres, so it sits with Pine Deep instead
    of fighting it
  - no people, no legible branding

Processed with ffmpeg: audio stripped (required for autoplay), scaled,
saturation 0.62, brightness -0.045, CRF 33.

  1920x1080  3.70 MB   desktop
  1280x720   2.08 MB   below 1024px
  poster     0.35 MB   exact first frame, so the handover does not flicker

## Overlay

The hero is ~2.06:1 while the source is 16:9, so object-cover crops top and
bottom and the road band, the brightest element, lands directly behind the
headline. The overlay opacity in hero-video.tsx is measured against that exact
crop, not chosen by eye: sampling 831,168 pixels from the region the headline
occupies, at 0.76 the worst-case pixel gives white 7.63:1 and Mist 200 5.02:1,
both clearing WCAG AA for body text. At 0.72 the Mist lede fell to 4.47:1.

Re-measure if the footage is ever replaced.

## Rejected

Pexels 32245112, forklift moving baled material: right idea, but a red vehicle
and a busy warehouse competed with the type.
Pexels 18093657 / 3195440, loose waste on sorting conveyors: visually chaotic,
high chroma, and full of identifiable consumer packaging. Loose mixed waste
reads as mess, which is the wrong signal for a company selling control.
The previous site's own hero was an aerial of a smokestack emitting smoke.
