<script lang="ts">
  import { resolve } from '$app/paths';
  import Image from '../design/Image.svelte';
  import { logoHero } from '../images';

  let {
    menu = 'site',
    section,
    email
  }: {
    menu?: 'site' | 'admin';
    section?: 'stock' | 'storage' | 'samples' | 'customers';
    email?: string;
  } = $props();
</script>

<nav aria-label="Primary">
  <a href={resolve('/#top')}>
    <Image {...logoHero} alt="Makeda Green Coffee" loading="eager" />
  </a>
  {#if menu === 'admin'}
    <div>
      {#if email}
        <p>Signed in as {email}.</p>
      {/if}
      <ul>
        <li>
          <a href={resolve('/admin')} aria-current={section === 'stock' ? 'page' : undefined}>
            Orders
          </a>
        </li>
        <li>
          <a
            href={resolve('/admin/storage')}
            aria-current={section === 'storage' ? 'page' : undefined}
          >
            Storage
          </a>
        </li>
        <li>
          <a
            href={resolve('/admin/samples')}
            aria-current={section === 'samples' ? 'page' : undefined}
          >
            Samples
          </a>
        </li>
        <li>
          <a
            href={resolve('/admin/customers')}
            aria-current={section === 'customers' ? 'page' : undefined}
          >
            Customers
          </a>
        </li>
        <li>
          <form method="POST" action="?/logout" style="margin: 0">
            <button type="submit">Log out</button>
          </form>
        </li>
      </ul>
    </div>
  {:else}
    <ul>
      <li><a href={resolve('/our-coffee')}>Our coffee</a></li>
      <li><a href={resolve('/about')}>About</a></li>
      <li><a href={resolve('/contact')}>Contact</a></li>
    </ul>
  {/if}
</nav>

<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 14px clamp(16px, 4vw, 40px);
    background: #fff;
  }

  nav > a {
    flex-shrink: 0;
  }

  nav > a :global(img) {
    display: block;
    width: 88px;
    height: auto;
  }

  nav > div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px 22px;
    min-width: 0;
  }

  nav > div p {
    margin: 0;
    min-width: 0;
    max-width: 100%;
    font-size: 13px;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px 22px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  ul a,
  ul button {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-decoration: none;
    text-transform: uppercase;
    cursor: pointer;
  }

  ul a:hover,
  ul button:hover,
  ul a[aria-current='page'] {
    color: var(--makeda-coffee);
  }

  ul a[aria-current='page'] {
    text-decoration: underline;
    text-underline-offset: 0.35em;
  }

  @media (max-width: 639px) {
    nav {
      gap: 12px;
      padding: 12px 16px;
    }

    nav > a :global(img) {
      width: 72px;
    }

    nav > div {
      flex: 1;
      gap: 4px 12px;
    }

    nav > div p {
      flex-basis: 100%;
      order: 1;
      font-size: 12px;
      text-align: right;
    }

    ul {
      flex: 1;
      flex-wrap: nowrap;
      justify-content: flex-end;
      gap: 6px 12px;
      min-width: 0;
    }

    ul a,
    ul button {
      font-size: 10px;
      letter-spacing: 0.1em;
      white-space: nowrap;
    }
  }
</style>
