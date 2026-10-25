<script lang="ts">
  import PageSection from '../design/PageSection.svelte';
  import Text from '../design/Text.svelte';
  import Page from './Page.svelte';
</script>

<svelte:head>
  <title>Privacy — Makeda Green Coffee</title>
</svelte:head>

<Page>
  <PageSection headingId="privacy-heading" title="PRIVACY" prose>
    <Text>This notice covers this website.</Text>
    <Text>
      If you use the contact form, we receive your name, email address, and message so we can reply.
      We do not add you to a mailing list. Service providers outside the EU help us run the site and
      deliver your message. We keep it in our inbox as part of our correspondence with you.
    </Text>
    <Text>
      We do not use analytics or advertising cookies. Loading the site may share your IP address with
      those providers.
    </Text>
    <Text>
      You can ask to see, correct, or delete what we hold, or withdraw the consent you gave on the
      form. Write to
      <a href="mailto:info@makedagreencoffee.com">info@makedagreencoffee.com</a>. You can also
      complain to the Swedish Authority for Privacy Protection (Integritetsskyddsmyndigheten) at
      imy.se.
    </Text>
    <Text>
      Makeda Green Coffee AB, Broby Ängsväg 11, 153 92 Hölö, Sweden. Organisation number 5594367913.
    </Text>
  </PageSection>
</Page>

<style>
  a {
    color: var(--makeda-coffee);
    font-weight: 600;
  }
</style>
