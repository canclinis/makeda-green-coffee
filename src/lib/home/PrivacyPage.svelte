<script lang="ts">
  import SectionTitle from '../design/SectionTitle.svelte';
  import Text from '../design/Text.svelte';
  import SitePage from './SitePage.svelte';
</script>

<svelte:head>
  <title>Privacy — Makeda Green Coffee</title>
</svelte:head>

<SitePage>
  <section aria-labelledby="privacy-heading">
    <SectionTitle id="privacy-heading">PRIVACY</SectionTitle>
    <div class="container">
      <div style="max-width: 42rem; margin-inline: auto">
        <Text>This notice covers the contact form on this website.</Text>
        <Text>
          When you send the form, we receive your name, email address, subject, and message. We
          receive them only if you confirm that you have read this notice.
        </Text>
        <Text>
          We use your message to reply to you. We do not add you to a mailing list. We do not sell
          your details, and we do not pass them on for advertising.
        </Text>
        <Text>
          The form sends your message as an email to info@makedagreencoffee.com. Aruba delivers that
          email. Vercel hosts the website and passes the form on so the email can be sent. We do not
          keep the message in a database on the site. It stays in our inbox while we deal with your
          request and any reply. We delete it when that conversation is finished.
        </Text>
        <Text>
          The site does not use analytics or advertising cookies. The pages load the Montserrat
          typeface from Google Fonts, so your browser sends your IP address to Google when it
          fetches the font. The host may keep ordinary server logs, such as an IP address and a
          browser, to run and protect the site.
        </Text>
        <Text>
          You can ask what we hold about you, ask us to correct it, or ask us to delete it. Write to
          <a href="mailto:info@makedagreencoffee.com">info@makedagreencoffee.com</a>. You can also
          complain to the Swedish Authority for Privacy Protection (Integritetsskyddsmyndigheten) at
          imy.se.
        </Text>
        <Text>
          Makeda Green Coffee AB, Broby Ängsväg 11, 153 92 Hölö, Sweden. Organisation number
          5594367913.
        </Text>
      </div>
    </div>
  </section>
</SitePage>

<style>
  section {
    background: #fff;
    border-inline: 25px solid var(--makeda-coffee);
  }

  .container {
    padding: 36px 0 56px;
  }

  a {
    color: var(--makeda-coffee);
    font-weight: 600;
  }
</style>
