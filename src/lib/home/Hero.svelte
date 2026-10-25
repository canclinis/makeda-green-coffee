<script lang="ts">
  import Button from '../design/Button.svelte';
  import Modal from '../design/Modal.svelte';
  import ContactForm from './ContactForm.svelte';

  let contactOpen = $state(false);
</script>

<section id="top" aria-label="Makeda Green Coffee" style="scroll-margin-top: 72px; line-height: 0">
  <div style="overflow: hidden; line-height: 0">
    <!-- Some frames have a 1px black row on the top and the bottom. -->
    <video
      src="/video/hero.mp4"
      poster="/images/hero-poster.jpg"
      width="1920"
      height="818"
      autoplay
      muted
      loop
      playsinline
      aria-label="Hero film"
      style="display: block; width: 100%; height: auto; transform: scale(1.02)"
    ></video>
  </div>
</section>

<section class="hero-cta">
  <div class="container hero-cta-inner">
    <p class="hero-cta-copy">
      Bring home a unique coffee, a symbol of strength and courage.
    </p>
    <Button variant="default" onclick={() => (contactOpen = true)}>Order now</Button>
    <Modal
      bind:open={contactOpen}
      title="Get in touch"
      image={{
        src: '/images/volcano.jpg',
        alt: 'A volcano rising above dense forest',
        objectPosition: 'top'
      }}
    >
      <ContactForm
        headingId="contact-modal-heading"
        hideHeading
        initialSubject="I'd like to order coffee"
        submitLabel="Order now"
      />
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
