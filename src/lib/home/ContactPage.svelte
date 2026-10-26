<script lang="ts">
  import PageSection from '../design/PageSection.svelte';
  import ZigZag from '../design/ZigZag.svelte';
  import ContactFilm from './ContactFilm.svelte';
  import ContactForm from './ContactForm.svelte';
  import Page from './Page.svelte';

  const subject = "I'd like to get in touch";
</script>

<svelte:head>
  <title>Contact — Makeda Green Coffee</title>
</svelte:head>

{#snippet contactFilm()}
  <ContactFilm
    src="/video/coffee_pill_women.mp4"
    poster="/images/contact-film-poster.jpg"
    label="Coffee film"
  />
{/snippet}

<Page>
  <PageSection id="contact" headingId="contact-heading" title="CONTACT">
    <ZigZag mediaSide="left" sticky mediaSlot={contactFilm}>
      <ContactForm headingId="contact-heading" hideHeading initialSubject={subject} />
    </ZigZag>
  </PageSection>
</Page>
