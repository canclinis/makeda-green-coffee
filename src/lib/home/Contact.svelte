<script lang="ts">
	import ContactForm from './ContactForm.svelte';
</script>

<section id="contact" class="contact" aria-labelledby="contact-heading">
	<div class="container container-xlarge contact-layout">
		<div class="contact-brand">
			<img
				class="footer-logo"
				src="/images/logo-footer.png"
				width="250"
				height="353"
				alt="Makeda Green Coffee"
			/>
			<p class="address">
				MAKEDA GREEN COFFEE<br />
				BROBY ÄNGSVÄG 11, 153 92 HÖLÖ, SWEDEN<br />
				ORG NO. 5594367913<br />
				VAT NO. SE559436791301<br />
				F-SKATT APPROVED
			</p>
			<div class="socials">
				<a
					class="icon-button"
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
				</a>
				<a
					class="icon-button"
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
				</a>
			</div>
			<div class="contact-links">
				<a class="button button-ghost" href="mailto:info@makedagreencoffee.com">
					<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="currentColor"
							d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.2-.5 7.3 5.1a.8.8 0 0 0 .9 0L20 6H4.2ZM20 8.2l-6.7 4.7a2.3 2.3 0 0 1-2.6 0L4 8.2V17.5c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V8.2Z"
						/>
					</svg>
					Contact Us
				</a>
				<a class="phone" href="tel:+46708749626">
					<img src="/images/icon-phone.svg" alt="" width="18" height="18" />
					+ 46 70 874 96 26
				</a>
				<a class="phone" href="tel:+393497646077">
					<img src="/images/icon-phone.svg" alt="" width="18" height="18" />
					+ 39 349 76 46 077
				</a>
			</div>
		</div>

		<ContactForm headingId="contact-heading" />
	</div>
</section>
