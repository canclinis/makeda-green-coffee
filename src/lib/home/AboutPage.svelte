<script lang="ts">
  import Image from '../design/Image.svelte';
  import PageSection from '../design/PageSection.svelte';
  import Text from '../design/Text.svelte';
  import { about } from '../images';
  import Page from './Page.svelte';
</script>

<svelte:head>
  <title>About Makeda Green Coffee</title>
  <meta
    name="description"
    content="Green coffee from Kivu. Antonio and Giovanni follow it from the cooperatives to the roastery door, with no intermediaries. Enquire about the project."
  />
</svelte:head>

{#snippet coffeeBean()}
  <svg viewBox="0 0 44 44" aria-hidden="true">
    <ellipse cx="22" cy="22" rx="14" ry="17.4" fill="currentColor" />
    <path d="M22 10.0v27.6" fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" />
  </svg>
{/snippet}

{#snippet band()}
  <Image
    {...about}
    alt="Coffee leaves covered in raindrops"
    priority
    style="width: 100%; height: min(42vw, 360px); object-fit: cover; object-position: center top"
  />
{/snippet}

<Page>
  <PageSection {band} headingId="about-heading" level={1} title="Who are we" prose>
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
    <ul>
      <li>
        {@render coffeeBean()}
        <span>
          Importing coffee from cooperatives in the Kivu region, to support the region’s growing
          economy;
        </span>
      </li>
      <li>
        {@render coffeeBean()}
        <span>
          bringing green coffee to European roasters who want a quality product, on terms and at
          prices that are fair to small and medium-sized producers;
        </span>
      </li>
      <li>
        {@render coffeeBean()}
        <span>
          improving the quality of coffee growing and processing in the cooperatives, by reinvesting
          part of our profits in equipment, training and logistical support;
        </span>
      </li>
      <li>
        {@render coffeeBean()}
        <span>
          following every step ourselves, from the Congo to the roastery door, with no
          intermediaries between the cooperative and the roaster.
        </span>
      </li>
    </ul>
  </PageSection>
</Page>

<style>
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 1.15rem;
  }

  li {
    display: grid;
    grid-template-columns: 1.25rem 1fr;
    column-gap: 0.75rem;
    align-items: start;
    font-size: 17px;
    line-height: 1.7;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.18em;
    color: var(--makeda-coffee);
  }
</style>
