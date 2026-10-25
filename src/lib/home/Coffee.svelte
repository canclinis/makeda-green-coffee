<script lang="ts">
	import SectionTitle from './SectionTitle.svelte';

	const desktopSpecs = [
		['REGION', 'D.R. Congo'],
		['SPECIES', 'Arabica'],
		['VARIETAL', 'Blue Montain & Red Bourbon'],
		['Harvesting Type', 'Handpicked'],
		['Processing', 'Fully washed\nDried at the sun in African beds'],
		['CLIMATE', 'Temperate Tropical'],
		['Environment', 'Mountain Range'],
		['ALTITUDE', '1450 – 1850 mt a.s.l.'],
		['SOIL', 'Volcanic rich in organic matter'],
		['CUP SCORE', '87+'],
		[
			'Cupping tasting notes',
			'Red apple / Bergamot / Lemon / Flora notes / Blackberry / Grapefruit / Bright citric acidity'
		]
	];

	const mobileSpecs = [
		['Variety', '100% Arabica Red Bourbon'],
		['Processing', 'Fully washed\nDried at the sun in African beds'],
		[
			'Cupping tasting notes',
			'Aromas of lemony, Complex fruits, floral notes, blackberry, and grapefruit with bright citric acidity.'
		]
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
			<p class="lead coffee-intro">
				The <span class="mark-yellow">cooperative</span>
				<span class="mark-yellow">produces</span> a <span class="mark-yellow">fully</span>
				<span class="mark-yellow">washed</span>
				<span class="mark-yellow">Arabica</span>
				<span class="mark-yellow">Blue</span>
				<span class="mark-yellow">Mountain</span>
				<span class="mark-yellow">specialty</span>
				<span class="mark-yellow">coffee</span>
				<span class="mark-yellow">K3</span> (Kivu3).
			</p>
			<ul class="specs specs-desktop">
				{#each desktopSpecs as [label, value] (label)}
					<li>
						<h3><span class="chip">{label}</span></h3>
						<p>
							{#each value.split('\n') as line, index (line)}
								{#if index > 0}<br />{/if}
								<span class="mark-yellow">{line}</span>
							{/each}
						</p>
					</li>
				{/each}
			</ul>
			<ul class="specs specs-mobile">
				{#each mobileSpecs as [label, value] (label)}
					<li>
						<h3><span class="chip">{label}</span></h3>
						<p>
							{#each value.split('\n') as line, index (line)}
								{#if index > 0}<br />{/if}
								<span class="mark-yellow">{line}</span>
							{/each}
						</p>
					</li>
				{/each}
			</ul>
		</div>
		<img
			class="coffee-photo"
			src="/images/coffee.jpeg"
			width="1707"
			height="2560"
			alt="A farmer letting washed coffee beans fall through his hands"
		/>
	</div>
</section>
