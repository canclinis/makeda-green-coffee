<script lang="ts">
  import SectionTitle from '../design/SectionTitle.svelte';
  import Text from '../design/Text.svelte';
  import SitePage from './SitePage.svelte';
</script>

<svelte:head>
  <title>About — Makeda Green Coffee</title>
</svelte:head>

<SitePage>
  <section aria-labelledby="about-heading">
    <div
      role="presentation"
      style="width: 100%; height: min(42vw, 360px); background: url('/images/about.jpg') center top / cover no-repeat"
    ></div>
    <SectionTitle id="about-heading">WHO WE ARE</SectionTitle>
    <div class="container">
      <div style="max-width: 42rem; margin-inline: auto">
        <Text>
          The founders, Antonio and Giovanni, are two friends, involved from 16 years in NGO and
          projects about human rights.
        </Text>
        <Text>
          Antonio is a filmmaker, who directed many documentaries in war zones: Afghanistan, Libya,
          Iraq, R.D.Congo. During the filming of his last documentary in D.R. Congo (“Amuka”),
          Antonio met a Cooperative of green coffee farmers from Kivu.
        </Text>
        <Text>
          Giovanni has been working for many years for NGO in Italy, Mexico, South East Asia and
          Sweden in many projects about human rights, sustainability and organic farming. He fell in
          love with the passion, the story and with the coffee of the Congolese farmers.
        </Text>
      </div>
    </div>
  </section>

  <section id="mission" style="scroll-margin-top: 80px" aria-labelledby="mission-heading">
    <SectionTitle id="mission-heading">OUR MISSION</SectionTitle>
    <div class="container">
      <Text style="margin: 28px auto 1.5rem; max-width: 42rem">
        Makeda Green Coffee has as primary objectives:
      </Text>
      <ul>
        <li>
          – Importing coffee from cooperatives in the Kivu region to support the region’s growing
          economy;
        </li>
        <li>
          – the marketing of green coffee by European roasters interested in a quality product which
          provides fair advantages and prices for small and medium-sized direct producers;
        </li>
        <li>
          – promote the quality of coffee cultivation and processing in cooperatives by reinvesting
          part of the company’s profits in equipment, training and logistical support;
        </li>
        <li>
          – following all the steps with no intermediaries between the cooperative and the
          roasteries. We follow all the steps from Congo to the door of the roasteries;
        </li>
      </ul>
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

  ul {
    max-width: 42rem;
    margin: 0 auto;
    padding: 0 0 24px;
    list-style: none;
    display: grid;
    gap: 1.1rem;
  }

  li {
    font-size: 17px;
    line-height: 1.7;
  }
</style>
