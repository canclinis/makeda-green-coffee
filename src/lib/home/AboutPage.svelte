<script lang="ts">
  import PageSection from '../design/PageSection.svelte';
  import Text from '../design/Text.svelte';
  import Page from './Page.svelte';
</script>

<svelte:head>
  <title>About — Makeda Green Coffee</title>
</svelte:head>

{#snippet band()}
  <img
    src="/images/about.jpg"
    alt="Coffee leaves covered in raindrops"
    width="2560"
    height="1702"
    style="display: block; width: 100%; height: min(42vw, 360px); object-fit: cover; object-position: center top"
  />
{/snippet}

<Page>
  <PageSection {band} headingId="about-heading" title="WHO WE ARE" prose>
    <Text>
      The founders, Antonio and Giovanni, are close friends who have worked with NGOs on human
      rights projects since 2007.
    </Text>
    <Text>
      Antonio is a filmmaker who has directed many documentaries in war zones: Afghanistan, Libya,
      Iraq and the DR Congo. While filming his most recent documentary in the DR Congo,
      <em>Amuka</em>, he met a cooperative of green coffee farmers from Kivu.
    </Text>
    <Text>
      Giovanni has spent many years working for NGOs in Italy, Mexico, South-East Asia and Sweden,
      on projects in human rights, sustainability and organic farming. He fell in love with the
      passion, the story and the coffee of the Congolese farmers.
    </Text>
  </PageSection>

  <PageSection id="mission" headingId="mission-heading" title="OUR MISSION" prose>
    <Text>Makeda Green Coffee has four main objectives:</Text>
    <ul style="margin: 0; padding: 0; list-style: none; display: grid; gap: 1.1rem">
      <li>
        – Importing coffee from cooperatives in the Kivu region, to support the region’s growing
        economy;
      </li>
      <li>
        – bringing green coffee to European roasters who want a quality product, on terms and at
        prices that are fair to small and medium-sized producers;
      </li>
      <li>
        – improving the quality of coffee growing and processing in the cooperatives, by reinvesting
        part of our profits in equipment, training and logistical support;
      </li>
      <li>
        – following every step ourselves, from the Congo to the roastery door, with no
        intermediaries between the cooperative and the roaster.
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
