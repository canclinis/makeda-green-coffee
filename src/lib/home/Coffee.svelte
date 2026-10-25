<script lang="ts">
  import { resolve } from '$app/paths';
  import Button from '../design/Button.svelte';
  import PageSection from '../design/PageSection.svelte';
  import Text from '../design/Text.svelte';
  import ZigZag from '../design/ZigZag.svelte';
</script>

<PageSection id="coffee" headingId="coffee-heading" title="OUR COFFEE">
  <ZigZag
    mediaSide="left"
    media={{
      type: 'image',
      src: '/images/coffee.jpeg',
      width: 1707,
      height: 2560,
      alt: 'A farmer letting washed coffee beans fall through his hands',
      sticky: true,
      style: 'border: 1px solid rgba(0, 0, 0, 0.08)'
    }}
  >
    <Text>
      From the heart of Lake Kivu. More than just coffee. Our coffee comes directly from local
      farming cooperatives around Lake Kivu, in the eastern Democratic Republic of the Congo. Grown
      at altitudes between 1,450 and 1,850 metres, on fertile volcanic soils and in a beautiful
      tropical mountain climate, this region offers exceptional conditions for growing high-quality
      Arabica coffee. At Makeda Green Coffee, we work hand in hand with local farmers, cooperatives
      and washing stations, building direct relationships based on trust, transparency and fair
      trade.
    </Text>
    <Text>
      We source both specialty and commercial-grade green coffee, making the incredible coffee of
      the Kivu region accessible to different kinds of roasters, without compromising our commitment
      to responsible sourcing and fair partnerships. But there’s much more behind every bean.
    </Text>
    <Text>
      Kivu is a region that has faced decades of conflict and instability. Yet despite every
      challenge, local farmers continue to cultivate their land, hand-pick their coffee cherries and
      produce remarkable coffee with passion and determination. That’s why we call it Resistance
      Coffee.
    </Text>
    <Text>We don’t just trade coffee. We build relationships.</Text>
    <Button href={resolve('/our-coffee')}>Discover our coffees</Button>
  </ZigZag>
</PageSection>
