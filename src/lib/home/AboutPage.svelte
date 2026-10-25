<script lang="ts">
  import PageSection from '../design/PageSection.svelte';
  import Text from '../design/Text.svelte';
  import Page from './Page.svelte';
</script>

<svelte:head>
  <title>About — Makeda Green Coffee</title>
</svelte:head>

{#snippet band()}
  <div
    role="presentation"
    style="width: 100%; height: min(42vw, 360px); background: url('/images/about.jpg') center top / cover no-repeat"
  ></div>
{/snippet}

<Page>
  <PageSection {band} headingId="about-heading" title="WHO WE ARE" prose>
    <Text>
      The founders, Antonio and Giovanni, are two friends, involved from 16 years in NGO and
      projects about human rights.
    </Text>
    <Text>
      Antonio is a filmmaker, who directed many documentaries in war zones: Afghanistan, Libya,
      Iraq, R.D.Congo. During the filming of his last documentary in D.R. Congo (“Amuka”), Antonio
      met a Cooperative of green coffee farmers from Kivu.
    </Text>
    <Text>
      Giovanni has been working for many years for NGO in Italy, Mexico, South East Asia and Sweden
      in many projects about human rights, sustainability and organic farming. He fell in love with
      the passion, the story and with the coffee of the Congolese farmers.
    </Text>
  </PageSection>

  <PageSection id="mission" headingId="mission-heading" title="OUR MISSION" prose>
    <Text>Makeda Green Coffee has as primary objectives:</Text>
    <ul style="margin: 0; padding: 0; list-style: none; display: grid; gap: 1.1rem">
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
        – following all the steps with no intermediaries between the cooperative and the roasteries.
        We follow all the steps from Congo to the door of the roasteries;
      </li>
    </ul>
  </PageSection>
</Page>

<style>
  li {
    font-size: 17px;
    line-height: 1.7;
  }
</style>
