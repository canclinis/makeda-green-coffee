<script lang="ts">
	import { resolve } from '$app/paths';
	import IconButton from '../design/IconButton.svelte';

	let { onEmail }: { onEmail?: () => void } = $props();

	const year = new Date().getFullYear();
</script>

<footer>
	<div class="container">
		<div class="columns">
			<div class="brand">
				<a href={resolve('/#top')}>
					<img src="/images/logo-footer.png" width="250" height="353" alt="Makeda Green Coffee" />
				</a>
				<p>We don't just trade coffee. We build relationships.</p>
				<div class="socials">
					<IconButton
						href="https://instagram.com/makedagreencoffee"
						rel="noreferrer"
						target="_blank"
						aria-label="Instagram"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-5 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8ZM17.4 6.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"
							/>
						</svg>
					</IconButton>
					<IconButton
						href="https://vimeo.com/user192364448"
						rel="noreferrer"
						target="_blank"
						aria-label="Vimeo"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M21.6 7.2c-.1 2.3-1.7 5.5-4.8 9.5-3.2 4.2-5.9 6.3-8.1 6.3-1.4 0-2.5-1.3-3.4-3.8L4 15.4C3.4 13.2 2.7 12.1 2 12.1c-.2 0-.8.4-1.8 1.1L0 11.7c1.1-1 2.2-2 3.3-2.9 1.5-1.3 2.6-2 3.4-2.1 1.5-.1 2.5.9 2.9 3.1.4 2.4.7 3.8 1 4.4.5 1 1.1 1.5 1.7 1.5.9 0 1.9-1.4 3-4.3 1-2.8 1.6-5 1.7-6.4.2-1.6-.5-2.4-1.9-2.4-.7 0-1.4.2-2.1.5 1.4-4.5 4-6.7 7.9-6.6 2.9.1 4.2 2 4.1 5.7Z"
							/>
						</svg>
					</IconButton>
					{#if onEmail}
						<IconButton aria-label="Email" onclick={onEmail}>
							{@render emailIcon()}
						</IconButton>
					{:else}
						<IconButton href={resolve('/contact')} aria-label="Email">
							{@render emailIcon()}
						</IconButton>
					{/if}
				</div>
			</div>

			<nav aria-label="Footer">
				<h2>Explore</h2>
				<ul>
					<li><a href={resolve('/')}>Home</a></li>
					<li><a href={resolve('/our-coffee')}>Our coffee</a></li>
					<li><a href={resolve('/about')}>About</a></li>
					<li><a href={resolve('/contact')}>Contact</a></li>
					<li><a href={resolve('/privacy')}>Privacy policy</a></li>
				</ul>
			</nav>

			<div>
				<h2>Contact</h2>
				<ul>
					<li>
						<a href="mailto:info@makedagreencoffee.com">info@<wbr />makedagreencoffee.com</a>
					</li>
					<li>
						<a href="tel:+46708749626">
							<span>Sweden</span>
							+ 46 70 874 96 26
						</a>
					</li>
					<li>
						<a href="tel:+393497646077">
							<span>Italy</span>
							+ 39 349 76 46 077
						</a>
					</li>
				</ul>
			</div>

			<div>
				<h2>Company</h2>
				<address>
					MAKEDA GREEN COFFEE AB<br />
					BROBY ÄNGSVÄG 11<br />
					153 92 HÖLÖ, SWEDEN<br />
					ORG NO. 5594367913<br />
					VAT NO. SE559436791301<br />
					F-SKATT APPROVED
				</address>
			</div>
		</div>

		<div class="bar">
			<p>© {year} Makeda Green Coffee AB</p>
			<div class="links">
				<a href={resolve('/privacy')}>Privacy</a>
				<a href={resolve('/#top')}>Back to top</a>
			</div>
		</div>
	</div>
</footer>

{#snippet emailIcon()}
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
		<path
			fill="currentColor"
			d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.2-.5 7.3 5.1a.8.8 0 0 0 .9 0L20 6H4.2ZM20 8.2l-6.7 4.7a2.3 2.3 0 0 1-2.6 0L4 8.2V17.5c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V8.2Z"
		/>
	</svg>
{/snippet}

<style>
	footer {
		background: var(--makeda-black);
		color: #fff;
		border-top: 4px solid var(--makeda-coffee);
	}

	.columns {
		display: grid;
		gap: 40px;
		padding: 56px 0 40px;
	}

	.brand > a,
	.brand > a:hover {
		display: inline-block;
		text-decoration: none;
	}

	.brand img {
		width: 132px;
		height: auto;
	}

	.brand p {
		max-width: 16rem;
		margin: 1.25rem 0;
		font-size: 15px;
		line-height: 1.55;
	}

	.socials {
		display: flex;
		gap: 8px;
	}

	h2 {
		margin: 0 0 18px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.18em;
		line-height: 1.2;
		text-transform: uppercase;
	}

	h2::after {
		content: '';
		display: block;
		width: 28px;
		height: 2px;
		margin-top: 12px;
		background: var(--makeda-coffee);
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	ul a {
		color: #fff;
		font-size: 14px;
		line-height: 1.45;
		text-decoration: none;
		overflow-wrap: anywhere;
	}

	ul a span {
		display: block;
		margin-bottom: 2px;
		color: rgba(255, 255, 255, 0.62);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	address {
		margin: 0;
		font-style: normal;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		line-height: 1.85;
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px 24px;
		padding: 20px 0 28px;
		border-top: 1px solid rgba(255, 255, 255, 0.16);
	}

	.bar p {
		margin: 0;
		font-size: 12px;
		letter-spacing: 0.04em;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
	}

	.bar a {
		color: #fff;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-decoration: none;
		text-transform: uppercase;
	}

	a:hover {
		text-decoration: underline;
	}

	a:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 3px;
	}

	@media (min-width: 720px) {
		.columns {
			grid-template-columns: 1fr 1fr;
			gap: 48px 40px;
		}
	}

	@media (min-width: 1040px) {
		.columns {
			grid-template-columns: 1.15fr 0.8fr 1.15fr 1.2fr;
			gap: 32px 48px;
			padding: 72px 0 48px;
		}
	}
</style>
