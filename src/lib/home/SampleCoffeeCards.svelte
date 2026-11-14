<script lang="ts">
  import { commercialLots, specialtyLots } from './coffee-lots';
  import Image from '../design/Image.svelte';

  let { selected = $bindable() }: { selected: string[] } = $props();

  const lots = [...specialtyLots, ...commercialLots].filter((lot) => lot.id !== 'natural-k4-2025');

  function splitProcess(origin: string) {
    const match = origin.match(/^(Fully Washed|Natural)(.*)$/);
    return match ? { process: match[1], rest: match[2] } : { process: '', rest: origin };
  }
</script>

<fieldset aria-labelledby="sample-step-question">
  {#each lots as lot (lot.id)}
    {@const name = splitProcess(lot.origin)}
    <label class="card">
      <input
        type="checkbox"
        name="samples"
        value={lot.id}
        bind:group={selected}
        aria-labelledby={`${lot.id}-name`}
      />
      <Image src={lot.image.src} alt={lot.image.alt} width={160} height={160} />
      <span class="card-copy">
        <span class="card-name" id={`${lot.id}-name`}
          >{#if name.process}<strong>{name.process}</strong>{/if}{name.rest}</span
        >
        <span
          >{lot.crop}{#if lot.selection}
            · {lot.selection}{/if}</span
        >
      </span>
    </label>
  {/each}
</fieldset>

<style>
  fieldset {
    margin: 0;
    padding: 0;
    border: 0;
  }

  .card {
    position: relative;
    display: grid;
    grid-template-columns: 72px 1fr;
    gap: 12px;
    align-items: center;
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid rgba(17, 17, 17, 0.28);
    border-radius: 12px;
    cursor: pointer;
  }

  .card:has(input:checked) {
    border-color: var(--makeda-coffee);
    box-shadow: inset 0 0 0 1px var(--makeda-coffee);
  }

  .card:has(input:focus-visible) {
    outline: 2px solid var(--makeda-coffee);
    outline-offset: 2px;
  }

  .card input {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: var(--makeda-coffee);
  }

  .card :global(img) {
    width: 72px;
    height: 72px;
    border-radius: 8px;
    object-fit: cover;
  }

  .card-copy {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-right: 18px;
    font-size: 14px;
    line-height: 1.35;
  }

  .card-name {
    font-size: 1rem;
    font-weight: 400;
  }

  .card-name strong {
    font-weight: 700;
  }
</style>
