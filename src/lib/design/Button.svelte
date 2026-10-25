<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'default' | 'burgundy' | 'icon';

  type Common = {
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
    variant = 'default',
    href,
    type = 'button',
    children,
    class: className,
    ...rest
  }: Props = $props();

  const classes = $derived(
    [
      variant === 'icon' ? 'icon-button' : 'button',
      variant === 'burgundy' ? 'button-burgundy' : '',
      className
    ]
      .filter(Boolean)
      .join(' ')
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
