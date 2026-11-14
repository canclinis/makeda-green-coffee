<script lang="ts">
  import Film from '../design/Film.svelte';
  import PageSection from '../design/PageSection.svelte';
  import ZigZag from '../design/ZigZag.svelte';
  import ContactForm from './ContactForm.svelte';
  import Page from './Page.svelte';

  const subject = "I'd like to get in touch";
</script>

<svelte:head>
  <title>Order Kivu green coffee — Makeda Green Coffee</title>
  <meta
    name="description"
    content="Send an enquiry to order green coffee from Lake Kivu, eastern DR Congo, for your roastery: specialty or commercial, fully washed or natural, in 60 kg bags."
  />
</svelte:head>

{#snippet contactFilm()}
  <div class="contact-film">
    <Film
      src="/video/coffee_pill_women.mp4"
      poster="/images/contact-film-poster.webp"
      label="Coffee film"
      width={720}
      height={720}
      autoplay
      preload="metadata"
    />
  </div>
{/snippet}

<Page>
  <PageSection id="contact" headingId="contact-heading" level={1} title="Order Kivu green coffee">
    <ZigZag mediaSide="left" sticky mediaSlot={contactFilm}>
      <ContactForm headingId="contact-heading" hideHeading initialSubject={subject} />
    </ZigZag>
  </PageSection>
</Page>

<style>
  @media (min-width: 640px) and (max-width: 759px) {
    .contact-film :global(video) {
      max-height: 320px;
      object-fit: cover;
    }
  }
</style>
