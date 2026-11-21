<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'default' | 'burgundy';

  type Common = {
    /** White button for dark fields (e.g. burgundy band). Default is burgundy. */
    variant?: Variant;
    /** Cannot be activated, e.g. the form is not valid yet. */
    disabled?: boolean;
    /** Work is in progress. Shows a spinner and blocks further clicks. */
    loading?: boolean;
    /** Work just finished (e.g. saved). Shows a check mark. Pair with `transientFlag` to clear it. */
    success?: boolean;
    children: Snippet;
    class?: string;
  };

  type Props = Common &
    (
      | ({
          href?: undefined;
          type?: 'button' | 'submit' | 'reset';
        } & Omit<HTMLButtonAttributes, 'class' | 'type' | 'disabled'>)
      | ({
          href: NonNullable<HTMLAnchorAttributes['href']>;
          type?: never;
        } & Omit<HTMLAnchorAttributes, 'class' | 'href' | 'type'>)
    );

  let {
    variant = 'burgundy',
    href,
    type = 'button',
    disabled = false,
    loading = false,
    success = false,
    children,
    class: className,
    ...rest
  }: Props = $props();

  const inactive = $derived(disabled || loading);
  const showSuccess = $derived(success && !loading);
  const classes = $derived(
    [
      'button',
      variant === 'burgundy' ? 'button-burgundy' : '',
      loading ? 'loading' : '',
      showSuccess ? 'success' : '',
      className
    ]
      .filter(Boolean)
      .join(' ')
  );
</script>

{#snippet content()}
  <span class="label">{@render children()}</span>
  {#if loading}
    <span class="spinner" aria-hidden="true"></span>
  {:else if showSuccess}
    <svg class="check" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  {/if}
{/snippet}

{#if inactive && href}
  <!-- A link without href is not navigable or focusable, so a disabled link cannot be followed. -->
  <a
    class={classes}
    role="link"
    aria-disabled="true"
    aria-busy={loading || undefined}
    {...rest as Omit<HTMLAnchorAttributes, 'class' | 'href'>}
  >
    {@render content()}
  </a>
{:else if href}
  <!-- Callers pass a path from resolve() or an external URL. -->
  <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
  <a {href} class={classes} {...rest as Omit<HTMLAnchorAttributes, 'class' | 'href'>}>
    {@render content()}
  </a>
{:else}
  <button
    {type}
    class={classes}
    disabled={inactive}
    aria-busy={loading || undefined}
    {...rest as Omit<HTMLButtonAttributes, 'class' | 'type' | 'disabled'>}
  >
    {@render content()}
  </button>
{/if}

<style>
  .button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0 36px;
    border: 1px solid transparent;
    border-radius: 12px;
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
    transition:
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease,
      opacity 160ms ease,
      transform 80ms ease;
  }

  .button-burgundy {
    background: var(--makeda-coffee);
    color: #fff;
    border-color: var(--makeda-coffee);
  }

  /* Interactive states only apply while the button can be used. */
  .button:not(:disabled, [aria-disabled='true']):hover {
    background: transparent;
    color: #fff;
    border-color: #fff;
  }

  .button-burgundy:not(:disabled, [aria-disabled='true']):hover {
    background: #fff;
    color: var(--makeda-coffee);
    border-color: var(--makeda-coffee);
  }

  .button:not(:disabled, [aria-disabled='true']):active {
    transform: translateY(1px);
  }

  .button:disabled,
  .button[aria-disabled='true'] {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .button.loading {
    opacity: 0.8;
    cursor: progress;
  }

  /* Success keeps full contrast even when the button is also disabled (e.g. a form that just reset). */
  .button.success {
    --success: #1f6b3a;
    background: var(--success);
    border-color: var(--success);
    color: #fff;
    opacity: 1;
    cursor: default;
  }

  /* The label stays in place (hidden, not removed) so the button keeps its width and its name. */
  .loading .label,
  .success .label {
    opacity: 0;
  }

  .check {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 18px;
    margin: -9px 0 0 -9px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .check path {
    stroke-dasharray: 16;
    stroke-dashoffset: 16;
    animation: draw 280ms ease-out forwards;
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 700ms linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .button {
      transition: none;
    }

    .spinner {
      animation-duration: 2s;
    }

    .check path {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
</style>
