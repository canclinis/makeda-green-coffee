import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Film from './Film.svelte';

describe('Film', () => {
  it('offers captions for the soundtrack', async () => {
    render(Film, {
      src: '/video/hero.mp4',
      label: 'Hero film',
      width: 1920,
      height: 818
    });

    const film = page.getByLabelText('Hero film');
    await expect.element(film).toBeVisible();
    expect(film.element().querySelector('track')?.getAttribute('kind')).toBe('captions');
  });

  it('lets the visitor mute the soundtrack and turn it back on', async () => {
    render(Film, {
      src: '/video/hero.mp4',
      label: 'Hero film',
      width: 1920,
      height: 818,
      autoplay: true,
      loop: true
    });

    const film = page.getByLabelText('Hero film');
    await expect.element(film).toBeVisible();
    await expect.poll(() => !(film.element() as HTMLVideoElement).paused).toBe(true);

    const sound = page.getByRole('button', { name: 'Sound', exact: true });
    const started = Date.now();
    await expect
      .poll(() => {
        const pressed = sound.element().getAttribute('aria-pressed');
        return pressed === 'true' || Date.now() - started > 600;
      })
      .toBe(true);

    if (sound.element().getAttribute('aria-pressed') === 'true') {
      await sound.click();
      await expect.element(sound).toHaveAttribute('aria-pressed', 'false');
      expect((film.element() as HTMLVideoElement).muted).toBe(true);
    }

    await sound.click();
    await expect.element(sound).toHaveAttribute('aria-pressed', 'true');
    const playing = film.element() as HTMLVideoElement;
    expect(playing.muted).toBe(false);
    expect(playing.paused).toBe(false);
    expect(playing.volume).toBeLessThan(1);

    await sound.click();
    await expect.element(sound).toHaveAttribute('aria-pressed', 'false');
    expect((film.element() as HTMLVideoElement).muted).toBe(true);
  });
});
