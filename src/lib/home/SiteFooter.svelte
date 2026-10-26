<script lang="ts">
	import { resolve } from '$app/paths';
	import IconButton from '../design/IconButton.svelte';
	import Modal from '../design/Modal.svelte';
	import ContactForm from './ContactForm.svelte';

	let { onEmail }: { onEmail?: () => void } = $props();

	let contactOpen = $state(false);

	const year = new Date().getFullYear();
</script>

<footer style="background: var(--makeda-black); color: #fff">
	<div class="container">
		<div class="compact">
			<div class="compact-top">
				<a href={resolve('/#top')} class="logo-link">
					<img
						src="/images/logo-footer.png"
						width="250"
						height="353"
						alt="Makeda Green Coffee"
						class="logo"
					/>
				</a>
				{@render socials()}
			</div>
			<p class="tagline compact-tagline">We don’t just trade coffee. We build relationships.</p>

			<details class="footer-details">
				<summary>Explore</summary>
				<nav aria-label="Footer">
					{@render exploreLinks()}
				</nav>
			</details>

			<details class="footer-details">
				<summary>Contact</summary>
				{@render contactLinks()}
			</details>

			<details class="footer-details">
				<summary>Company</summary>
				{@render companyAddress()}
			</details>
		</div>

		<div class="columns desktop">
			<div class="brand">
				<a href={resolve('/#top')} class="logo-link">
					<img
						src="/images/logo-footer.png"
						width="250"
						height="353"
						alt="Makeda Green Coffee"
						class="logo logo-large"
					/>
				</a>
				<p class="tagline">We don’t just trade coffee. We build relationships.</p>
				{@render socials()}
			</div>

			<nav aria-label="Footer">
				<h2>Explore</h2>
				{@render exploreLinks()}
			</nav>

			<div>
				<h2>Contact</h2>
				{@render contactLinks()}
			</div>

			<div>
				<h2>Company</h2>
				{@render companyAddress()}
			</div>
		</div>

		<div class="bar">
			<p>© {year} Makeda Green Coffee AB</p>
			<div class="bar-links">
				<a class="bar-link" href={resolve('/privacy')}>Privacy</a>
				<a class="bar-link" href={resolve('/#top')}>Back to top</a>
			</div>
		</div>
	</div>
</footer>

{#if !onEmail}
	<Modal
		bind:open={contactOpen}
		title="Get in touch"
		image={{
			src: '/images/volcano.jpg',
			alt: 'A volcano rising above dense forest',
			objectPosition: 'top'
		}}
	>
		<ContactForm
			headingId="email-contact-heading"
			hideHeading
			initialSubject="I'd like to get in touch"
		/>
	</Modal>
{/if}

{#snippet contactLinks()}
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
{/snippet}

{#snippet exploreLinks()}
	<ul>
		<li><a href={resolve('/')}>Home</a></li>
		<li><a href={resolve('/our-coffee')}>Our coffee</a></li>
		<li><a href={resolve('/about')}>About</a></li>
		<li><a href={resolve('/contact')}>Contact</a></li>
	</ul>
{/snippet}

{#snippet socials()}
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
			<IconButton aria-label="Email" onclick={() => (contactOpen = true)}>
				{@render emailIcon()}
			</IconButton>
		{/if}
	</div>
{/snippet}

{#snippet companyAddress()}
	<address class="company">
		MAKEDA GREEN COFFEE AB<br />
		BROBY ÄNGSVÄG 11<br />
		153 92 HÖLÖ, SWEDEN<br />
		ORG NO. 5594367913<br />
		VAT NO. SE559436791301<br />
		F-SKATT APPROVED
	</address>
{/snippet}

{#snippet emailIcon()}
	<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
		<path
			fill="currentColor"
			d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.2-.5 7.3 5.1a.8.8 0 0 0 .9 0L20 6H4.2ZM20 8.2l-6.7 4.7a2.3 2.3 0 0 1-2.6 0L4 8.2V17.5c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V8.2Z"
		/>
	</svg>
{/snippet}

<style>
	.compact {
		display: block;
		padding: 32px 0 24px;
	}

	.desktop {
		display: none;
	}

	.compact-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.compact-top .socials {
		flex-shrink: 0;
		justify-content: flex-end;
	}


	.logo-link {
		display: inline-block;
		flex-shrink: 0;
		text-decoration: none;
	}

	.logo {
		display: block;
		width: 88px;
		height: auto;
	}

	.logo-large {
		width: 132px;
	}

	.socials {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.footer-details {
		margin: 0;
		border-top: 1px solid rgba(255, 255, 255, 0.16);
		padding-top: 16px;
	}

	.footer-details summary {
		cursor: pointer;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.18em;
		line-height: 1.2;
		list-style: none;
		text-transform: uppercase;
	}

	.footer-details summary::-webkit-details-marker {
		display: none;
	}

	.footer-details summary::after {
		content: '';
		display: block;
		width: 28px;
		height: 2px;
		margin-top: 10px;
		background: var(--makeda-coffee);
	}

	.footer-details ul {
		margin-top: 16px;
	}

	.footer-details .company {
		margin-top: 16px;
	}

	.columns {
		gap: 40px;
		padding: 56px 0 40px;
	}

	.tagline {
		margin: 0;
	}

	.brand .tagline {
		max-width: 16rem;
		margin: 1.25rem 0;
		font-size: 15px;
		line-height: 1.55;
	}

	.compact .tagline.compact-tagline {
		margin: 10px 0 18px;
		font-size: clamp(12px, 3.1vw, 14px);
		line-height: 1.45;
		white-space: nowrap;
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

	.company {
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

	.bar-links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
	}

	.bar-link {
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

	a:focus-visible,
	.footer-details summary:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 3px;
	}

	@media (min-width: 720px) {
		.compact .tagline.compact-tagline {
			white-space: normal;
			max-width: 28rem;
		}
	}

	@media (min-width: 1040px) {
		.compact {
			display: none;
		}

		.desktop {
			display: grid;
			grid-template-columns: 1.15fr 0.8fr 1.15fr 1.2fr;
			gap: 32px 48px;
			padding: 72px 0 48px;
		}
	}
</style>
