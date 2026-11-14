<script lang="ts">
  import { tick } from 'svelte';
  import { commercialLots, specialtyLots } from './coffee-lots';
  import { sampleSizes } from './sample-sizes';
  import Button from '../design/Button.svelte';
  import SampleAmountChoices from './SampleAmountChoices.svelte';
  import SampleCoffeeCards from './SampleCoffeeCards.svelte';
  import SampleContactFields from './SampleContactFields.svelte';
  import SamplePreview from './SamplePreview.svelte';

  let { onclose }: { onclose?: () => void } = $props();

  const lots = [...specialtyLots, ...commercialLots];
  const question = {
    1: 'Which coffees would you like to try?',
    2: 'How much does your roaster need?',
    3: 'Where should we send them?',
    4: 'Does this look right?'
  } as const;

  let step = $state<1 | 2 | 3 | 4>(1);
  let selected = $state<string[]>([]);
  let grams = $state<number | ''>('');
  let roastery = $state('');
  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let street = $state('');
  let postalCode = $state('');
  let city = $state('');
  let country = $state('');
  let message = $state('');
  let status = $state('');
  let sending = $state(false);
  let thanks = $state('');
  let stepHeading = $state<HTMLHeadingElement | null>(null);
  let alertEl = $state<HTMLParagraphElement | null>(null);
  let formEl = $state<HTMLFormElement | null>(null);

  const chosen = $derived(
    selected.flatMap((id) => {
      const lot = lots.find((item) => item.id === id);
      return lot ? [lot] : [];
    })
  );
  const chosenSize = $derived(sampleSizes.find((size) => size.grams === grams));
  const amountLine = $derived(
    chosenSize ? `${chosenSize.label} of each — ${chosenSize.paid ? 'price by email' : 'free'}` : ''
  );

  async function fail(message: string) {
    status = message;
    await tick();
    alertEl?.focus();
  }

  async function go(nextStep: 1 | 2 | 3 | 4) {
    status = '';
    step = nextStep;
    await tick();
    stepHeading?.focus();
  }

  async function next() {
    if (step === 1 && selected.length === 0) {
      await fail('Choose at least one coffee.');
      return;
    }
    if (step === 2 && grams === '') {
      await fail('Choose how many grams.');
      return;
    }
    if (step === 3 && !formEl?.reportValidity()) return;
    if (step < 4) await go((step + 1) as 1 | 2 | 3 | 4);
  }

  function back() {
    if (step > 1) void go((step - 1) as 1 | 2 | 3 | 4);
  }

  function thankYou(person: string, count: number, amount: string, place: string) {
    const first = person.trim().split(/\s+/)[0] || person;
    const posted = count === 1 ? `1 coffee, ${amount}` : `${count} coffees, ${amount} each`;
    return `Thank you, ${first}. We’ll post ${posted}, to ${place}.`;
  }

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (step < 4) {
      await next();
      return;
    }
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || sending || !form.reportValidity()) return;

    sending = true;
    status = 'Sending your request.';

    try {
      const response = await fetch('/api/sample', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          samples: selected,
          grams: Number(grams),
          roastery,
          name,
          email,
          phone,
          street,
          postalCode,
          city,
          country,
          message,
          consent: true
        })
      });
      if (!response.ok) throw new Error('Sample request was not accepted');

      const posted = thankYou(name, selected.length, chosenSize?.label ?? '', city.trim());
      roastery = '';
      name = '';
      email = '';
      phone = '';
      street = '';
      postalCode = '';
      city = '';
      country = '';
      message = '';
      selected = [];
      grams = '';
      const privacy = form.querySelector('input[name="privacy"]');
      if (privacy instanceof HTMLInputElement) privacy.checked = false;
      status = '';
      thanks = posted;
    } catch {
      status = 'We could not send your request. Please try again.';
    } finally {
      sending = false;
    }
  }
</script>

{#if thanks}
  <div class="done">
    <p class="thanks">{thanks}</p>
    <Button type="button" onclick={() => onclose?.()}>Close</Button>
  </div>
{:else}
  <form bind:this={formEl} onsubmit={onSubmit}>
    <div class="progress" style:--progress={step / 4} aria-hidden="true">
      <span></span>
    </div>
    <p class="step">Step {step} of 4</p>
    <h3 class="question" id="sample-step-question" tabindex="-1" bind:this={stepHeading}>
      {question[step]}
    </h3>
    {#if status}
      <p class="alert" role="alert" tabindex="-1" bind:this={alertEl}>{status}</p>
    {/if}

    {#if step === 1}
      <SampleCoffeeCards bind:selected />
    {:else if step === 2}
      <SampleAmountChoices bind:grams />
    {:else if step === 3}
      <SampleContactFields
        bind:roastery
        bind:name
        bind:email
        bind:phone
        bind:street
        bind:postalCode
        bind:city
        bind:country
        bind:message
      />
    {:else}
      <SamplePreview
        coffees={chosen.map((lot) => ({ origin: lot.origin, crop: lot.crop }))}
        amount={amountLine}
        {name}
        {roastery}
        {email}
        {phone}
        {street}
        {postalCode}
        {city}
        {country}
        {message}
        onChangeCoffees={() => go(1)}
        onChangeAddress={() => go(3)}
      />
    {/if}

    <div class="actions">
      {#if step > 1}
        <button type="button" class="text-button" onclick={back}>Back</button>
      {/if}
      {#if step < 4}
        <Button type="button" onclick={next}>Next</Button>
      {:else}
        <Button type="submit" disabled={sending}>Get samples</Button>
      {/if}
    </div>
  </form>
{/if}

<style>
  .progress {
    height: 6px;
    margin: 0 0 1.25rem;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(17, 17, 17, 0.1);
  }

  .progress span {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: var(--makeda-coffee);
    transform: scaleX(var(--progress));
    transform-origin: left center;
    transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .step {
    margin: 0 0 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .question {
    margin: 0 0 14px;
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.25;
  }

  .question:focus {
    outline: none;
  }

  .alert {
    margin: -6px 0 14px;
    color: var(--makeda-coffee);
    font-weight: 700;
  }

  .alert:focus {
    outline: none;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 8px;
  }

  .text-button {
    padding: 0;
    border: 0;
    background: none;
    color: var(--makeda-ink);
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .text-button:hover {
    color: var(--makeda-coffee);
  }

  .thanks {
    margin: 0 0 24px;
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.35;
  }

  @media (prefers-reduced-motion: reduce) {
    .progress span {
      transition: none;
    }
  }
</style>
