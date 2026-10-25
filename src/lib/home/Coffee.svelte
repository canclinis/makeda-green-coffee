<script lang="ts">
	import SectionTitle from './SectionTitle.svelte';

	const lots = [
		{
			origin: 'Arabica Fully Washed K3 Microlot Special Selection',
			bags: '42 × 60 kg',
			status: 'Arriving soon'
		},
		{
			origin: 'Arabica Fully Washed K3',
			bags: '92 × 60 kg',
			status: 'Arriving soon'
		},
		{
			origin: 'Arabica Natural K3 Special Selection',
			bags: '84 × 60 kg',
			status: 'Arriving soon'
		},
		{
			origin: 'Arabica Natural K3',
			bags: '100 × 60 kg',
			status: 'Arriving soon'
		}
	];
</script>

<section id="coffee" class="section" aria-labelledby="coffee-heading">
	<SectionTitle id="coffee-heading">OUR COFFEE</SectionTitle>
	<div class="container container-xlarge coffee-layout">
		<div class="coffee-copy">
			<p class="coffee-kicker">Makeda Green Coffee</p>
			<p class="lead coffee-intro">
				The <span class="mark-yellow">plantations</span> are situated
				<span class="mark-yellow">around</span>
				<span class="mark-yellow">Lake</span>
				<span class="mark-yellow">Kivu</span> on <span class="mark-yellow">volcanic</span>
				<span class="mark-yellow">soils</span>
				<span class="mark-yellow">rich</span> in <span class="mark-yellow">organic</span> matter,
				between 1450 and 1850 mt. above sea level in a <span class="mark-yellow">temperate</span>
				<span class="mark-yellow">tropical</span>
				<span class="mark-yellow">climate</span>.
			</p>
			<p class="lead coffee-intro">
				This <span class="mark-yellow">coffee</span> is <span class="mark-yellow">very</span>
				<span class="mark-yellow">precious</span> because is <span class="mark-yellow">from</span> a
				<span class="mark-yellow">red</span>
				<span class="mark-yellow">zone</span> area, a <span class="mark-yellow">land</span> of
				<span class="mark-yellow">warfare</span> so it’s a <span class="mark-yellow">symbol</span>
				of
				<span class="mark-yellow">resistance</span>
				<span class="mark-yellow">of</span> the <span class="mark-yellow">farmers</span>
				<span class="mark-yellow">keep</span> going <span class="mark-yellow">working</span>. All
				the
				<span class="mark-yellow">coffee</span> is <span class="mark-yellow">handpicked</span>.
			</p>
		</div>
		<div class="coffee-lots-scroll">
			<table class="coffee-lots">
				<caption>Specialty coffee, crop 2026</caption>
				<thead>
					<tr>
						<th scope="col">Origin</th>
						<th scope="col">Bags</th>
						<th scope="col">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each lots as lot (lot.origin)}
						<tr>
							<td>{lot.origin}</td>
							<td>{lot.bags}</td>
							<td>{lot.status}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
