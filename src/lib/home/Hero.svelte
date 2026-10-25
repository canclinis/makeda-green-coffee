<script lang="ts">
  import Button from '../design/Button.svelte';
  import Modal from '../design/Modal.svelte';
  import ContactForm from './ContactForm.svelte';

  let contactOpen = $state(false);
</script>

<section id="top" class="hero" aria-label="Makeda Green Coffee">
  <div class="hero-video">
    <video
      src="/video/hero.mp4"
      poster="/images/hero-poster.jpg"
      autoplay
      muted
      loop
      playsinline
      aria-label="Hero film"
    ></video>
  </div>
</section>

<section class="order-bar">
  <div class="container order-bar-inner">
    <p class="order-line">Bring home a unique coffee, a symbol of strength and courage.</p>
    <Button onclick={() => (contactOpen = true)}>Order now</Button>
    <Modal bind:open={contactOpen} labelledBy="contact-modal-heading">
      <ContactForm headingId="contact-modal-heading" />
    </Modal>
  </div>
</section>
