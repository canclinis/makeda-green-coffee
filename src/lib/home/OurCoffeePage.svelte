<script lang="ts">
	import { tick } from 'svelte';
	import ContactForm from './ContactForm.svelte';
	import SectionTitle from './SectionTitle.svelte';
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

	let dialog = $state<HTMLDialogElement | null>(null);
	let inquirySubject = $state('');

	async function requestInfo(lot: Lot) {
		inquirySubject = `Inquiry: ${lot.origin}, crop ${lot.crop}`;
		await tick();
		dialog?.showModal();
	}

	function onBackdrop(event: MouseEvent) {
		if (event.target === dialog) dialog?.close();
	}
</script>

<svelte:head>
	<title>Our coffee — Makeda Green Coffee</title>
</svelte:head>

<SiteNav />

<section class="section coffee-page" aria-labelledby="our-coffee-heading">
	<SectionTitle id="our-coffee-heading">OUR COFFEE</SectionTitle>
	<div class="container container-xlarge coffee-catalog">
		{@render lotTable('Specialty coffee', specialty)}
		{@render lotTable('Commercial coffee', commercial)}
	</div>
	<dialog
		class="contact-modal"
		bind:this={dialog}
		aria-labelledby="coffee-inquiry-heading"
		onclick={onBackdrop}
	>
		<button class="modal-close" type="button" aria-label="Close" onclick={() => dialog?.close()}>
			×
		</button>
		{#if inquirySubject}
			{#key inquirySubject}
				<ContactForm headingId="coffee-inquiry-heading" initialSubject={inquirySubject} />
			{/key}
		{/if}
	</dialog>
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
					<tr>
						<td data-label="Origin">{lot.origin}</td>
						<td data-label="Crop">{lot.crop}</td>
						<td data-label="Bags">{lot.bags}</td>
						<td data-label="Status">{lot.status}</td>
						<td>
							<button class="button button-burgundy" type="button" onclick={() => requestInfo(lot)}>
								Request info
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}
