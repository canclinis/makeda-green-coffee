<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  type Props = {
    children: Snippet;
    class?: string;
  } & (
    | ({
        href?: undefined;
        type?: 'button' | 'submit' | 'reset';
      } & Omit<HTMLButtonAttributes, 'class' | 'type'>)
    | ({
        href: NonNullable<HTMLAnchorAttributes['href']>;
        type?: never;
      } & Omit<HTMLAnchorAttributes, 'class' | 'href' | 'type'>)
  );

  let { href, type = 'button', children, class: className, ...rest }: Props = $props();

  const classes = $derived(['icon-button', className].filter(Boolean).join(' '));
</script>

{#if href}
  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
  <a {href} class={classes} {...rest as Omit<HTMLAnchorAttributes, 'class' | 'href'>}>
    {@render children()}
  </a>
{:else}
  <button {type} class={classes} {...rest as Omit<HTMLButtonAttributes, 'class' | 'type'>}>
    {@render children()}
  </button>
{/if}

<style>
  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 50%;
    background: transparent;
    color: #fff;
    font: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  .icon-button:hover {
    background: #fff;
    color: var(--makeda-ink);
  }
</style>
