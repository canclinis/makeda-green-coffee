<script lang="ts">
  import PageSection from '../design/PageSection.svelte';
  import Text from '../design/Text.svelte';
  import ZigZag from '../design/ZigZag.svelte';
</script>

<PageSection id="project" headingId="project-heading" title="The Project">
  <ZigZag
    mediaSide="right"
    media={{
      type: 'image',
      src: '/images/logo-symbol-burgundy.jpg',
      width: 420,
      height: 420,
      alt: '',
      style: 'width: min(100%, 320px); margin-inline: auto'
    }}
  >
    <Text>
      Makeda Green Coffee is a project of sustainability and fair trade commerce born in 2021. The
      goal is to support the Congolese farmers from Kivu, a region that suffered for a war during
      decades, to reach the Roasteries in Europe.
    </Text>
    <Text>
      This coffee is a symbol of resistance, these women and men risk their lives to deliver this
      coffee. That’s why we call it Resistance Coffee.
    </Text>
    <Text>We are not intermediaries, we follow all stages from the field to the delivery.</Text>
    <Text>We’re a Swedish company with an Italian soul!</Text>
  </ZigZag>
</PageSection>
