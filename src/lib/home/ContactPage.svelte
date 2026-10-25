<script lang="ts">
  import SectionTitle from '../design/SectionTitle.svelte';
  import ZigZag from '../design/ZigZag.svelte';
  import ContactFilm from './ContactFilm.svelte';
  import ContactForm from './ContactForm.svelte';
  import SitePage from './SitePage.svelte';

  const subject = "I'd like to get in touch";

  let contactForm = $state<HTMLFormElement | null>(null);

  function openForm() {
    contactForm?.scrollIntoView({ block: 'start' });
    contactForm
      ?.querySelector<HTMLInputElement>('input[name="name"]')
      ?.focus({ preventScroll: true });
  }
</script>

<svelte:head>
  <title>Contact — Makeda Green Coffee</title>
</svelte:head>

{#snippet contactFilm()}
  <ContactFilm
    src="/video/coffee_pill_women.mp4"
    poster="/images/contact-film-poster.jpg"
    label="Coffee film"
    sticky
  />
{/snippet}

<SitePage onEmail={openForm}>
  <section id="contact" aria-labelledby="contact-heading">
    <SectionTitle id="contact-heading">CONTACT</SectionTitle>
    <ZigZag mediaSide="left" mediaSlot={contactFilm}>
      <ContactForm
        headingId="contact-heading"
        hideHeading
        initialSubject={subject}
        bind:element={contactForm}
      />
    </ZigZag>
  </section>
</SitePage>

<style>
  section {
    scroll-margin-top: 80px;
    padding-bottom: 72px;
    background: #fff;
    border-inline: 25px solid var(--makeda-coffee);
  }
</style>
