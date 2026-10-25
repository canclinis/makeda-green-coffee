<script lang="ts">
  import { resolve } from '$app/paths';
  import SectionTitle from './SectionTitle.svelte';
</script>

<section id="coffee" class="section" aria-labelledby="coffee-heading">
  <SectionTitle id="coffee-heading">OUR COFFEE</SectionTitle>
  <div class="container container-xlarge coffee-layout">
    <div class="coffee-copy">
      <p class="lead coffee-intro">
        From the heart of Lake Kivu. More than just coffee. Our coffee comes directly from local
        farming cooperatives around Lake Kivu, in the eastern Democratic Republic of Congo. Grown at
        altitudes between 1,450 and 1,850 metres, on fertile volcanic soils and in a beautiful
        tropical mountain climate, this region offers exceptional conditions for growing
        high-quality Arabica coffee. At Makeda Green Coffee, we work hand in hand with local
        farmers, cooperatives and washing stations, building direct relationships based on trust,
        transparency and fair trade.
      </p>
      <p class="lead coffee-intro">
        We source both specialty and commercial-grade green coffee, making the incredible coffee of
        the Kivu region accessible to different kinds of roasters, without compromising our
        commitment to responsible sourcing and fair partnerships. But there's much more behind every
        bean.
      </p>
      <p class="lead coffee-intro">
        Kivu is a region that has faced decades of conflict and instability. Yet, despite all the
        challenges, local farmers continue to cultivate their land, handpick their coffee cherries
        and produce remarkable coffee with passion and determination. That's why we call it
        Resistance Coffee.
      </p>
      <p class="lead coffee-intro">We don't just trade coffee. We build relationships.</p>
      <a class="button button-burgundy" href={resolve('/our-coffee')}>Discover our coffees</a>
    </div>
    <img
      class="coffee-photo"
      src="/images/coffee.jpeg"
      width="1707"
      height="2560"
      alt="A farmer letting washed coffee beans fall through his hands"
    />
  </div>
</section>
