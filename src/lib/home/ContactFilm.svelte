<script lang="ts">
  import { browser } from '$app/env';
  import { beforeNavigate } from '$app/navigation';
  import { onDestroy, onMount } from 'svelte';
  import { contactFilmVolume } from './contact-film';

  const LEAVE_FADE_MS = 700;

  let {
    src,
    poster,
    label,
    width = 720,
    height = 720,
    sticky = false
  }: {
    src: string;
    poster?: string;
    label: string;
    width?: number;
    height?: number;
    sticky?: boolean;
  } = $props();

  let video = $state<HTMLVideoElement | null>(null);
  let volumeRaf = 0;
  let leaveRaf = 0;
  let stopping = false;

  function syncVolumeFromTimeline() {
    if (!video || stopping) return;
    video.volume = contactFilmVolume(video.currentTime, video.duration);
  }

  function runVolumeLoop() {
    cancelAnimationFrame(volumeRaf);
    const step = () => {
      syncVolumeFromTimeline();
      if (video && !video.paused && !video.ended) {
        volumeRaf = requestAnimationFrame(step);
      }
    };
    volumeRaf = requestAnimationFrame(step);
  }

  async function beginPlayback() {
    const el = video;
    if (!el || stopping) return;
    stopping = false;
    el.currentTime = 0;
    el.muted = false;
    el.volume = 0;
    try {
      await el.play();
      if (video !== el) return;
      runVolumeLoop();
    } catch {
      if (!video) return;
      el.muted = true;
      try {
        await el.play();
        if (video !== el) return;
        el.muted = false;
        runVolumeLoop();
      } catch {
        /* autoplay blocked */
      }
    }
  }

  function stopPlayback() {
    if (!video || stopping) return;
    stopping = true;
    cancelAnimationFrame(volumeRaf);
    cancelAnimationFrame(leaveRaf);
    const startVol = video.volume;
    const start = performance.now();
    const step = (now: number) => {
      if (!video) return;
      const p = Math.min(1, (now - start) / LEAVE_FADE_MS);
      video.volume = startVol * (1 - p);
      if (p < 1) {
        leaveRaf = requestAnimationFrame(step);
      } else {
        video.pause();
        video.currentTime = 0;
        video.volume = 0;
        stopping = false;
      }
    };
    leaveRaf = requestAnimationFrame(step);
  }

  function onPlay() {
    if (!stopping) runVolumeLoop();
  }

  function onPause() {
    cancelAnimationFrame(volumeRaf);
  }

  function onEnded() {
    cancelAnimationFrame(volumeRaf);
    if (video) {
      video.volume = 0;
    }
  }

  function onVisibilityChange() {
    if (document.hidden) stopPlayback();
    else void beginPlayback();
  }

  onMount(() => {
    if (!browser) return;
    document.addEventListener('visibilitychange', onVisibilityChange);
    void beginPlayback();
  });

  onDestroy(() => {
    if (!browser) return;
    document.removeEventListener('visibilitychange', onVisibilityChange);
    cancelAnimationFrame(volumeRaf);
    cancelAnimationFrame(leaveRaf);
    video?.pause();
  });

  beforeNavigate(({ from }) => {
    if (from?.url.pathname === '/contact') stopPlayback();
  });
</script>

<video
  bind:this={video}
  class="media"
  class:sticky
  {src}
  {poster}
  {width}
  {height}
  aria-label={label}
  controls
  playsinline
  preload="metadata"
  onplay={onPlay}
  onpause={onPause}
  onended={onEnded}
></video>

<style>
  .media {
    display: block;
    width: 100%;
    height: auto;
  }

  @media (min-width: 960px) {
    .sticky {
      position: sticky;
      top: 88px;
    }
  }
</style>
