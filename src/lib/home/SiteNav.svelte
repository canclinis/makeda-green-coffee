<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<nav class="site-nav" aria-label="Primary">
  <a class="site-nav-brand" href={resolve('/#top')}>
    <img src="/images/logo-hero.png" width="140" height="52" alt="Makeda Green Coffee" />
  </a>
  <ul class="site-nav-links">
    <li><a href={resolve('/#project')}>The Project</a></li>
    <li><a href={resolve('/#mission')}>Mission</a></li>
    <li><a href={resolve('/#coffee')}>Coffee</a></li>
    <li><a href={resolve('/#about')}>About</a></li>
    <li><a href={resolve('/#contact')}>Contact</a></li>
  </ul>
</nav>
