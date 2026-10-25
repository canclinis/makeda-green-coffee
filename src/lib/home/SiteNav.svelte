<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<nav aria-label="Primary">
	<a href={resolve('/#top')}>
		<img src="/images/logo-hero.png" width="140" height="52" alt="Makeda Green Coffee" />
	</a>
	<ul>
		<li><a href={resolve('/our-coffee')}>Our coffee</a></li>
		<li><a href={resolve('/about')}>About</a></li>
		<li><a href={resolve('/contact')}>Contact</a></li>
	</ul>
</nav>

<style>
	nav {
		position: sticky;
		top: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 14px clamp(16px, 4vw, 40px);
		background: #fff;
	}

	nav > a {
		flex-shrink: 0;
	}

	nav > a img {
		display: block;
		width: 88px;
		height: auto;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 8px 22px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	ul a {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-decoration: none;
		text-transform: uppercase;
	}

	ul a:hover {
		color: var(--makeda-coffee);
	}

	@media (max-width: 639px) {
		nav {
			align-items: flex-start;
		}

		nav > a img {
			width: 72px;
		}

		ul {
			gap: 6px 14px;
			max-width: 12rem;
		}
	}
</style>
