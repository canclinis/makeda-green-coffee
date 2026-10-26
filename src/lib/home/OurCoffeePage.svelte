<script lang="ts">
  import { tick } from 'svelte';
  import Button from '../design/Button.svelte';
  import Modal from '../design/Modal.svelte';
  import PageSection from '../design/PageSection.svelte';
  import Text from '../design/Text.svelte';
  import ContactForm from './ContactForm.svelte';
  import Page from './Page.svelte';
  import CoffeeLotDetail from './CoffeeLotDetail.svelte';
  import { commercialLots, specialtyLots, type CoffeeLot } from './coffee-lots';

  const specialty = specialtyLots;
  const commercial = commercialLots;

  let inquiryOpen = $state(false);
  let inquirySubject = $state('');
  let lotOpen = $state(false);
  let selectedLot = $state<CoffeeLot | null>(null);
  let activeCategory = $state<'specialty' | 'commercial'>('specialty');

  async function requestInfo(lot: CoffeeLot) {
    inquirySubject = `Enquiry: ${lot.origin}, ${lot.crop}`;
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

<Page>
  <PageSection headingId="our-coffee-heading" title="OUR COFFEE">
    <Text style="max-width: 42rem">
      Green coffee from Lake Kivu: specialty and commercial, fully washed and natural, K3 and K4, in
      60 kg bags.
    </Text>
    <div class="lot-tabs" role="tablist" aria-label="Coffee categories">
      <button
        type="button"
        class="lot-tab"
        role="tab"
        id="lot-tab-specialty"
        aria-selected={activeCategory === 'specialty'}
        aria-controls="lot-panel-specialty"
        onclick={() => (activeCategory = 'specialty')}
      >
        Specialty
      </button>
      <button
        type="button"
        class="lot-tab"
        role="tab"
        id="lot-tab-commercial"
        aria-selected={activeCategory === 'commercial'}
        aria-controls="lot-panel-commercial"
        onclick={() => (activeCategory = 'commercial')}
      >
        Commercial
      </button>
    </div>
    <div style="overflow-x: auto">
      <table>
        <caption>Coffee lots</caption>
        {@render lotGroup('Specialty coffee', specialty, 'specialty')}
        {@render lotGroup('Commercial coffee', commercial, 'commercial')}
      </table>
    </div>
    <Modal
      bind:open={inquiryOpen}
      title="Coffee enquiry"
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
  </PageSection>
</Page>

{#snippet lotGroup(title: string, rows: CoffeeLot[], category: 'specialty' | 'commercial')}
  <tbody
    id="lot-panel-{category}"
    class="lot-group"
    class:is-active={activeCategory === category}
    aria-labelledby="lot-tab-{category}"
  >
    <tr>
      <th class="group" colspan="5" scope="rowgroup">{title}</th>
    </tr>
    <tr>
      <th scope="col">Origin</th>
      <th class="center" scope="col">Crop</th>
      <th class="center" scope="col">Bags (60 kg)</th>
      <th class="center" scope="col">Status</th>
      <th class="center" scope="col">Request</th>
    </tr>
    {#each rows as lot (lot.id)}
      <tr onclick={() => openLot(lot)} onkeydown={(event) => onRowKeydown(event, lot)} tabindex="0">
        <td class="lot-origin" data-label="Origin">{lot.origin}</td>
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
{/snippet}

<style>
  .lot-tabs {
    display: none;
  }

  .lot-tab {
    flex: 1;
    min-height: 44px;
    margin: 0;
    padding: 12px 8px 10px;
    border: 0;
    border-bottom: 3px solid transparent;
    background: transparent;
    color: rgba(17, 17, 17, 0.52);
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    line-height: 1.25;
    text-transform: none;
    cursor: pointer;
    transition:
      color 0.15s ease,
      border-color 0.15s ease,
      background-color 0.15s ease;
  }

  .lot-tab[aria-selected='true'] {
    color: var(--makeda-coffee);
    border-bottom-color: var(--makeda-coffee);
    font-weight: 700;
  }

  .lot-tab:focus-visible {
    outline: 2px solid var(--makeda-coffee);
    outline-offset: -2px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
    line-height: 1.45;
  }

  caption {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .group {
    padding: 0 0 0.75rem;
    border-bottom: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-align: left;
    text-transform: uppercase;
  }

  tbody + tbody .group {
    padding-top: 56px;
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

  th[scope='col'] {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border-bottom-color: var(--makeda-ink);
  }

  tbody tr:has(td) {
    cursor: pointer;
  }

  tbody tr:has(td):hover {
    background: rgba(92, 16, 34, 0.06);
  }

  tbody tr:has(td):focus-visible {
    outline: 2px solid var(--makeda-coffee);
    outline-offset: -2px;
  }

  @media (max-width: 959px) {
    .lot-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 18px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    tbody.lot-group:not(.is-active) {
      display: none;
    }

    table,
    tbody,
    tr,
    td,
    th {
      display: block;
      width: auto;
    }

    tbody.lot-group.is-active {
      display: block;
    }

    tr:has(> .group) {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }

    tr:has(th[scope='col']) {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }

    tr:has(td) {
      margin: 0 0 14px;
      padding: 16px 14px 14px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: #fff;
    }

    tr:has(td):last-child {
      margin-bottom: 0;
    }

    td {
      padding: 0;
      border-bottom: 0;
      font-size: 14px;
      line-height: 1.4;
    }

    td.lot-origin {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      font-size: 15px;
      font-weight: 700;
      line-height: 1.35;
    }

    td.lot-origin::before {
      display: none;
    }

    td[data-label]:not(.lot-origin) {
      display: grid;
      grid-template-columns: 5.75rem 1fr;
      gap: 4px 10px;
      align-items: baseline;
      padding: 5px 0;
    }

    td[data-label]::before {
      content: attr(data-label);
      margin: 0;
      color: rgba(17, 17, 17, 0.55);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.16em;
      line-height: 1.3;
      text-transform: uppercase;
    }

    td[data-label='Status'] {
      color: rgba(17, 17, 17, 0.72);
      font-size: 13px;
    }

    td:last-child {
      padding-top: 14px;
    }

    .center {
      text-align: left;
    }

    td:last-child :global(.button) {
      width: 100%;
    }
  }
</style>
