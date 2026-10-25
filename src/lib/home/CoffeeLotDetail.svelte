<script lang="ts">
  import Button from '../design/Button.svelte';
  import type { CoffeeLot } from './coffee-lots';

  let { lot }: { lot: CoffeeLot } = $props();
</script>

<p
  style="margin: 0 0 0.75rem; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase"
>
  {lot.crop} crop · {lot.bags} bags · {lot.status}
</p>
{#if lot.selection}
  <p
    style="margin: 0 0 1rem; color: var(--makeda-coffee); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase"
  >
    {lot.selection}
  </p>
{/if}
<p style="margin: 0 0 1.25rem; line-height: 1.55">{lot.summary}</p>

<table>
  <caption>Origin &amp; lot details</caption>
  <tbody>
    {#each lot.originDetails as row (row.term)}
      <tr>
        <th scope="row">{row.term}</th>
        <td>{row.description}</td>
      </tr>
    {/each}
    <tr>
      <th scope="row">Process</th>
      <td>{lot.process}</td>
    </tr>
  </tbody>
</table>

{#if lot.highlights?.length}
  <h3
    style="margin: 0 0 0.75rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase"
  >
    Highlights
  </h3>
  <ul style="margin: 0 0 1.25rem; padding-left: 1.1rem; line-height: 1.5">
    {#each lot.highlights as highlight (highlight)}
      <li>{highlight}</li>
    {/each}
  </ul>
{/if}

{#if lot.profileNote}
  <p style="margin: 0 0 1.25rem; line-height: 1.55; font-size: 0.85rem; opacity: 0.85">
    {lot.profileNote}
  </p>
{/if}

<div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.5rem">
  {#each lot.pdfs as pdf (pdf.href)}
    <Button href={pdf.href} download={pdf.fileName}>Download {pdf.label}</Button>
  {/each}
</div>

<style>
  table {
    width: 100%;
    margin: 0 0 1.25rem;
    border-collapse: collapse;
    font-size: 0.95rem;
    line-height: 1.45;
  }

  caption {
    margin: 0 0 0.75rem;
    padding: 0;
    caption-side: top;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  th,
  td {
    padding: 0.65rem 0.75rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid rgba(17, 17, 17, 0.1);
  }

  th {
    width: 38%;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--makeda-coffee);
    background: rgba(92, 16, 34, 0.04);
  }

  td {
    font-weight: 500;
  }

  tr:last-child th,
  tr:last-child td {
    border-bottom: 0;
  }
</style>
