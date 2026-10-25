<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'default' | 'burgundy';

  type Common = {
    /** White button for dark fields (e.g. burgundy band). Default is burgundy. */
    variant?: Variant;
    children: Snippet;
    class?: string;
  };

  type Props = Common &
    (
      | ({
          href?: undefined;
          type?: 'button' | 'submit' | 'reset';
        } & Omit<HTMLButtonAttributes, 'class' | 'type'>)
      | ({
          href: NonNullable<HTMLAnchorAttributes['href']>;
          type?: never;
        } & Omit<HTMLAnchorAttributes, 'class' | 'href' | 'type'>)
    );

  let {
    variant = 'burgundy',
    href,
    type = 'button',
    children,
    class: className,
    ...rest
  }: Props = $props();

  const classes = $derived(
    ['button', variant === 'burgundy' ? 'button-burgundy' : '', className].filter(Boolean).join(' ')
  );
</script>

{#if href}
  <!-- Callers pass a path from resolve() or an external URL. -->
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
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0 36px;
    border: 1px solid transparent;
    background: #fff;
    color: var(--makeda-ink);
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    line-height: 1;
    text-decoration: none;
    text-transform: uppercase;
    cursor: pointer;
  }

  .button:hover {
    background: transparent;
    color: #fff;
    border-color: #fff;
  }

  .button-burgundy {
    background: var(--makeda-coffee);
    color: #fff;
    border-color: var(--makeda-coffee);
  }

  .button-burgundy:hover {
    background: #fff;
    color: var(--makeda-coffee);
    border-color: var(--makeda-coffee);
  }
</style>
