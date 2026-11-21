<script lang="ts">
  import { sampleSizes } from './sample-sizes';

  let { grams = $bindable() }: { grams: number | '' } = $props();

  const rows = [
    { caption: 'Free', sizes: sampleSizes.filter((size) => !size.paid) },
    {
      caption: 'Cost may apply, confirmed by email',
      sizes: sampleSizes.filter((size) => size.paid)
    }
  ];
</script>

<p class="hint">Choose the smallest amount your roaster can roast.</p>
<fieldset class="amounts" aria-labelledby="sample-step-question">
  {#each rows as row (row.caption)}
    <div class="row">
      <p class="caption">{row.caption}</p>
      <div class="tiles">
        {#each row.sizes as size (size.grams)}
          <label class="amount">
            <input
              type="radio"
              name="grams"
              value={size.grams}
              checked={grams === size.grams}
              onchange={() => (grams = size.grams)}
            />
            <span>{size.label}</span>
          </label>
        {/each}
      </div>
    </div>
  {/each}
</fieldset>

<style>
  .hint {
    margin: -6px 0 14px;
    font-size: 1rem;
    line-height: 1.45;
  }

  .amounts {
    display: grid;
    gap: 14px;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .caption {
    margin: 0 0 8px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(17, 17, 17, 0.7);
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .amount {
    position: relative;
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 12px 14px;
    border: 1px solid rgba(17, 17, 17, 0.28);
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .amount:has(input:checked) {
    border-color: var(--makeda-coffee);
    background: var(--makeda-coffee);
    color: #fff;
  }

  .amount:has(input:checked) input {
    accent-color: #fff;
  }

  .amount:has(input:focus-visible) {
    outline: 2px solid var(--makeda-coffee);
    outline-offset: 2px;
  }

  .amount input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: var(--makeda-coffee);
  }
</style>
