<script lang="ts">
  import Button from '../design/Button.svelte';
  import Film from '../design/Film.svelte';
  import Modal from '../design/Modal.svelte';
  import SampleForm from './SampleForm.svelte';

  let sampleOpen = $state(false);
</script>

<section id="top" aria-label="Makeda Green Coffee" style="scroll-margin-top: 72px; line-height: 0">
  <div style="overflow: hidden; line-height: 0">
    <!-- Some frames have a 1px black row on the top and the bottom. -->
    <Film
      src="/video/hero.mp4"
      poster="/images/hero-poster.webp"
      label="Hero film"
      width={1920}
      height={818}
      autoplay
      loop
      style="display: block; width: 100%; height: auto; transform: scale(1.02)"
    />
  </div>
</section>

<section class="hero-cta">
  <div class="container hero-cta-inner">
    <p class="hero-cta-copy">Bring home a unique coffee, a symbol of strength and courage.</p>
    <Button variant="default" onclick={() => (sampleOpen = true)}>Get free sample</Button>
    <Modal pinned bind:open={sampleOpen} title="Get a free sample">
      <SampleForm onclose={() => (sampleOpen = false)} />
    </Modal>
  </div>
</section>

<style>
  .hero-cta {
    background: var(--makeda-coffee);
    color: #fff;
    padding: 28px 0;
  }

  .hero-cta-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .hero-cta-copy {
    flex: 1 1 16rem;
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    line-height: 1.45;
    text-transform: uppercase;
  }

  @media (max-width: 639px) {
    .hero-cta {
      padding: 20px 0 24px;
    }

    .hero-cta-inner {
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      gap: 20px;
      width: 100%;
      margin-inline: 0;
    }

    .hero-cta-copy {
      flex: none;
      padding-inline: 20px;
    }

    .hero-cta-inner :global(.button) {
      /* Page section frame is 12px each side. */
      width: calc(100% - 24px);
      margin-inline: auto;
    }
  }
</style>
