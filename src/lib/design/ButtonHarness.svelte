<script lang="ts">
  import Button from './Button.svelte';
</script>

<Button>Order now</Button>
<Button variant="burgundy" href="/our-coffee">Discover our coffees</Button>
<Button
  variant="icon"
  href="https://instagram.com/makedagreencoffee"
  aria-label="Instagram"
  target="_blank"
  rel="noreferrer"
>
  icon
</Button>
<Button type="submit" disabled>Get In Touch</Button>
