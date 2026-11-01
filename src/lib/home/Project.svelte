<script lang="ts">
  import PageSection from '../design/PageSection.svelte';
  import Text from '../design/Text.svelte';
  import ZigZag from '../design/ZigZag.svelte';
</script>

<PageSection id="project" headingId="project-heading" level={1} title="Green coffee from Congo">
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
      We help the Kivu cooperatives reach roasters in Europe with green coffee beans from eastern
      DR Congo. Makeda Green Coffee started with them in 2021, in a region scarred by decades of
      war.
    </Text>
    <Text>
      This coffee is a symbol of resistance. The women and men who grow it risk their lives to bring
      it to market. That’s why we call it Resistance Coffee.
    </Text>
    <Text>We are not intermediaries. We follow every stage, from the field to delivery.</Text>
    <Text>We’re a Swedish company with an Italian soul!</Text>
  </ZigZag>
</PageSection>
