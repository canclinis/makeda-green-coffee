<script lang="ts">
  import { tick } from 'svelte';
  import Button from '../design/Button.svelte';
  import Modal from '../design/Modal.svelte';
  import ContactForm from './ContactForm.svelte';
  import SectionTitle from '../design/SectionTitle.svelte';
  import SitePage from './SitePage.svelte';
  import CoffeeLotDetail from './CoffeeLotDetail.svelte';
  import { commercialLots, specialtyLots, type CoffeeLot } from './coffee-lots';

  const specialty = specialtyLots;
  const commercial = commercialLots;

  let inquiryOpen = $state(false);
  let inquirySubject = $state('');
  let lotOpen = $state(false);
  let selectedLot = $state<CoffeeLot | null>(null);

  async function requestInfo(lot: CoffeeLot) {
    inquirySubject = `Inquiry: ${lot.origin}, ${lot.crop}`;
    await tick();
    inquiryOpen = true;
  }

  function openLot(lot: CoffeeLot) {
    selectedLot = lot;
    lotOpen = true;
  }

  function onRowKeydown(event: KeyboardEvent, lot: CoffeeLot) {
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openLot(lot);
  }
</script>

<svelte:head>
  <title>Our coffee — Makeda Green Coffee</title>
</svelte:head>

<SitePage>
  <section aria-labelledby="our-coffee-heading">
    <SectionTitle id="our-coffee-heading">OUR COFFEE</SectionTitle>
    <div class="container">
      {@render lotTable('Specialty coffee', specialty)}
      {@render lotTable('Commercial coffee', commercial)}
    </div>
  <Modal
    bind:open={inquiryOpen}
    title="Coffee inquiry"
    image={{
      src: '/images/lots/dried-on-bed.jpg',
      alt: 'Hands sorting green coffee beans on a drying bed'
    }}
  >
    {#if inquirySubject}
      {#key inquirySubject}
        <ContactForm
          headingId="coffee-inquiry-heading"
          hideHeading
          initialSubject={inquirySubject}
          submitLabel="Order"
        />
      {/key}
    {/if}
  </Modal>
    <Modal bind:open={lotOpen} title={selectedLot?.origin ?? 'Coffee'} image={selectedLot?.image}>
      {#if selectedLot}
        <CoffeeLotDetail lot={selectedLot} />
      {/if}
    </Modal>
  </section>
</SitePage>

{#snippet lotTable(caption: string, rows: CoffeeLot[])}
  <div>
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Origin</th>
          <th class="center" scope="col">Crop</th>
          <th class="center" scope="col">Bags (60 kg)</th>
          <th class="center" scope="col">Status</th>
          <th class="center" scope="col">Request</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as lot (lot.id)}
          <tr
            onclick={() => openLot(lot)}
            onkeydown={(event) => onRowKeydown(event, lot)}
            tabindex="0"
          >
            <td data-label="Origin" style="font-weight: 600">{lot.origin}</td>
            <td class="center" data-label="Crop">{lot.crop}</td>
            <td class="center" data-label="Bags">{lot.bags}</td>
            <td class="center" data-label="Status">{lot.status}</td>
            <td class="center">
              <Button
                style="padding-inline: 16px; white-space: nowrap"
                onclick={(event: MouseEvent) => {
                  event.stopPropagation();
                  requestInfo(lot);
                }}
              >
                Order
              </Button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/snippet}

<style>
  section {
    padding-bottom: 72px;
    background: #fff;
    border-inline: 25px solid var(--makeda-coffee);
  }

  .container {
    display: grid;
    gap: 56px;
    padding: 36px 0 56px;
  }

  .container > div {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
    line-height: 1.45;
  }

  caption {
    caption-side: top;
    margin: 0 0 0.75rem;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  th,
  td {
    padding: 14px 12px;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .center {
    text-align: center;
    vertical-align: middle;
  }

  thead th {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border-bottom-color: var(--makeda-ink);
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover {
    background: rgba(92, 16, 34, 0.06);
  }

  tbody tr:focus-visible {
    outline: 2px solid var(--makeda-coffee);
    outline-offset: -2px;
  }

  @media (max-width: 720px) {
    table,
    tbody,
    tr,
    td {
      display: block;
      width: auto;
    }

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }

    tr {
      padding: 16px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    td[data-label]::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 2px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    td {
      padding: 2px 0;
      border-bottom: 0;
      font-size: 13px;
    }

    td:last-child {
      padding-top: 12px;
    }
  }
</style>
