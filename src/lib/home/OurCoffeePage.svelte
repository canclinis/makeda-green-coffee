<script lang="ts">
  import { tick } from 'svelte';
  import Button from '../design/Button.svelte';
  import Modal from '../design/Modal.svelte';
  import ContactForm from './ContactForm.svelte';
  import SectionTitle from '../design/SectionTitle.svelte';
  import SiteNav from './SiteNav.svelte';
  import './home.css';

  type Lot = {
    origin: string;
    crop: string;
    bags: string;
    status: string;
  };

  const specialty: Lot[] = [
    {
      origin: 'Arabica Fully Washed K3 Microlot Special Selection',
      crop: '2026',
      bags: '42 × 60 kg',
      status: 'Arriving soon'
    },
    {
      origin: 'Arabica Fully Washed K3 Microlot Special Selection',
      crop: '2025',
      bags: '2 × 60 kg',
      status: 'In store'
    },
    {
      origin: 'Arabica Fully Washed K3',
      crop: '2026',
      bags: '92 × 60 kg',
      status: 'Arriving soon'
    },
    {
      origin: 'Arabica Natural K3 Special Selection',
      crop: '2026',
      bags: '84 × 60 kg',
      status: 'Arriving soon'
    },
    {
      origin: 'Arabica Natural K3',
      crop: '2026',
      bags: '100 × 60 kg',
      status: 'Arriving soon'
    }
  ];

  const commercial: Lot[] = [
    {
      origin: 'Arabica Natural K4',
      crop: '2025',
      bags: '1 × 60 kg',
      status: 'In store'
    }
  ];

  let inquiryOpen = $state(false);
  let inquirySubject = $state('');
  let lotOpen = $state(false);
  let selectedLot = $state<Lot | null>(null);

  async function requestInfo(lot: Lot) {
    inquirySubject = `Inquiry: ${lot.origin}, ${lot.crop}`;
    await tick();
    inquiryOpen = true;
  }

  function openLot(lot: Lot) {
    selectedLot = lot;
    lotOpen = true;
  }

  function onRowKeydown(event: KeyboardEvent, lot: Lot) {
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openLot(lot);
  }
</script>

<svelte:head>
  <title>Our coffee — Makeda Green Coffee</title>
</svelte:head>

<SiteNav />

<section class="section coffee-page" aria-labelledby="our-coffee-heading">
  <SectionTitle id="our-coffee-heading">OUR COFFEE</SectionTitle>
  <div class="container coffee-catalog">
    {@render lotTable('Specialty coffee', specialty)}
    {@render lotTable('Commercial coffee', commercial)}
  </div>
  <Modal bind:open={inquiryOpen} labelledBy="coffee-inquiry-heading">
    {#if inquirySubject}
      {#key inquirySubject}
        <ContactForm headingId="coffee-inquiry-heading" initialSubject={inquirySubject} />
      {/key}
    {/if}
  </Modal>
  <Modal bind:open={lotOpen} title={selectedLot?.origin ?? 'Coffee'}>
    {#if selectedLot}
      <p>{selectedLot.crop} crop. {selectedLot.bags}. {selectedLot.status}.</p>
      <p>More about this coffee is coming soon.</p>
    {/if}
  </Modal>
</section>

{#snippet lotTable(caption: string, rows: Lot[])}
  <div class="coffee-lots-scroll">
    <table class="coffee-lots">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Origin</th>
          <th scope="col">Crop</th>
          <th scope="col">Bags</th>
          <th scope="col">Status</th>
          <th scope="col">Request</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as lot (`${lot.origin}-${lot.crop}`)}
          <tr
            onclick={() => openLot(lot)}
            onkeydown={(event) => onRowKeydown(event, lot)}
            tabindex="0"
          >
            <td data-label="Origin">{lot.origin}</td>
            <td data-label="Crop">{lot.crop}</td>
            <td data-label="Bags">{lot.bags}</td>
            <td data-label="Status">{lot.status}</td>
            <td>
              <Button
                variant="burgundy"
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
