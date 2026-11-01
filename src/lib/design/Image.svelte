<script lang="ts">
  let {
    src,
    alt,
    width,
    height,
    priority = false,
    loading,
    style
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** First picture on the page. Loaded immediately, ahead of other images. */
    priority?: boolean;
    loading?: 'eager' | 'lazy';
    style?: string;
  } = $props();
</script>

<img
  {src}
  {alt}
  {width}
  {height}
  {style}
  loading={priority ? 'eager' : (loading ?? 'lazy')}
  fetchpriority={priority ? 'high' : undefined}
/>

<style>
  img {
    display: block;
    max-width: 100%;
  }
</style>
