<script lang="ts">
  import { beforeNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { FILM_FADE_IN_SEC, FILM_FADE_OUT_SEC, filmVolume } from './film-volume';
  import IconButton from './IconButton.svelte';

  const LEAVE_FADE_MS = 700;

  let {
    src,
    poster,
    label,
    width,
    height,
    loop = false,
    autoplay = false,
    preload = 'metadata',
    style = 'display: block; width: 100%; height: auto',
    class: className
  }: {
    src: string;
    poster?: string;
    label: string;
    width: number;
    height: number;
    loop?: boolean;
    autoplay?: boolean;
    preload?: 'none' | 'metadata' | 'auto';
    style?: string;
    class?: string;
  } = $props();

  let video = $state<HTMLVideoElement | null>(null);
  let quiet = $state(true);
  let userMuted = false;
  let heardAt = 0;
  let volumeRaf = 0;
  let leaveRaf = 0;
  let stopping = false;
  let arming = false;
  let closed = false;

  function cancelVolume() {
    cancelAnimationFrame(volumeRaf);
  }

  function runVolumeLoop() {
    cancelVolume();
    const step = () => {
      const el = video;
      if (!el || quiet || stopping) return;
      const heardFor = (performance.now() - heardAt) / 1000;
      el.volume = filmVolume(
        el.currentTime,
        el.duration,
        heardFor,
        FILM_FADE_IN_SEC,
        loop ? 0 : FILM_FADE_OUT_SEC
      );
      if (!el.paused && !el.ended) volumeRaf = requestAnimationFrame(step);
    };
    volumeRaf = requestAnimationFrame(step);
  }

  function holdMuted() {
    const el = video;
    if (!el || closed) return;
    quiet = true;
    el.muted = true;
    cancelVolume();
    void el.play().catch(() => {});
  }

  function turnSoundOn() {
    const el = video;
    if (!el || closed || userMuted || stopping || !quiet) return;
    arming = true;
    quiet = false;
    heardAt = performance.now();
    el.muted = false;
    el.volume = 0;
    void el
      .play()
      .then(() => {
        if (closed || video !== el) return;
        runVolumeLoop();
        setTimeout(() => {
          arming = false;
        }, 400);
      })
      .catch(() => {
        arming = false;
        if (!userMuted) holdMuted();
      });
  }

  function mute() {
    userMuted = true;
    quiet = true;
    arming = false;
    cancelVolume();
    if (video) video.muted = true;
  }

  function toggleSound(event: MouseEvent) {
    event.stopPropagation();
    if (quiet) {
      userMuted = false;
      turnSoundOn();
    } else {
      mute();
    }
  }

  function onGesture(event: Event) {
    const target = event.target;
    if (target instanceof Element && target.closest('[data-film-sound]')) return;
    turnSoundOn();
  }

  function onPlay() {
    if (autoplay || userMuted || stopping || !quiet) return;
    const el = video;
    if (!el) return;
    quiet = false;
    heardAt = performance.now();
    el.muted = false;
    el.volume = 0;
    runVolumeLoop();
  }

  function onPause() {
    cancelVolume();
    if (!arming || userMuted) return;
    arming = false;
    holdMuted();
  }

  function onEnded() {
    cancelVolume();
    if (video) video.volume = 0;
  }

  function stopPlayback() {
    const el = video;
    if (!el || stopping) return;
    stopping = true;
    arming = false;
    cancelVolume();
    cancelAnimationFrame(leaveRaf);
    const startVol = el.volume;
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
        quiet = true;
        stopping = false;
      }
    };
    leaveRaf = requestAnimationFrame(step);
  }

  function onVisibilityChange() {
    if (document.hidden) stopPlayback();
    else if (autoplay && !userMuted) turnSoundOn();
  }

  onMount(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (autoplay) {
      document.addEventListener('pointerdown', onGesture, true);
      document.addEventListener('keydown', onGesture, true);
    }
    const el = video;
    if (autoplay && el) {
      el.muted = true;
      quiet = true;
      void el
        .play()
        .then(() => {
          if (!closed && !userMuted) turnSoundOn();
        })
        .catch(() => {});
    }

    return () => {
      closed = true;
      document.removeEventListener('pointerdown', onGesture, true);
      document.removeEventListener('keydown', onGesture, true);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelVolume();
      cancelAnimationFrame(leaveRaf);
    };
  });

  beforeNavigate(() => {
    if (video && !video.paused) stopPlayback();
  });
</script>

<div class="film" style="position: relative">
  <video
    bind:this={video}
    class={className}
    {src}
    {poster}
    {width}
    {height}
    {loop}
    {preload}
    playsinline
    aria-label={label}
    {style}
    onplay={onPlay}
    onpause={onPause}
    onended={onEnded}
  >
    <track kind="captions" srclang="en" label="English" />
  </video>
  <IconButton
    class="film-sound"
    aria-label="Sound"
    aria-pressed={!quiet}
    title={quiet ? 'Turn sound on' : 'Mute'}
    data-film-sound
    onclick={toggleSound}
  >
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      {#if quiet}
        <path d="M16 9l5 6M21 9l-5 6" />
      {:else}
        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />
      {/if}
    </svg>
  </IconButton>
</div>

<style>
  .film :global(.film-sound) {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 1;
    background: var(--makeda-coffee);
    border-color: var(--makeda-coffee);
  }

  .film :global(.film-sound:hover) {
    background: #fff;
    border-color: var(--makeda-coffee);
    color: var(--makeda-coffee);
  }
</style>
