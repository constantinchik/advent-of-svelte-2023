<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		AppRail,
		AppRailAnchor
	} from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	// Floating UI for Popups
	import {
		computePosition,
		autoUpdate,
		flip,
		shift,
		offset,
		arrow
	} from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<img
					class="w-10"
					src="https://advent.sveltesociety.dev/_app/immutable/assets/santa-svelte.CGuQl2Dd.png"
					alt="Svelte logo with a santa hat on top of it"
				/>
				<strong class="text-xl uppercase">Advent Of Svelte 2023&nbsp;</strong>
				<span class="text-sm">(by constantinchik)</span>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/constantinchik/advent-of-svelte-2023"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<AppRail>
			<svelte:fragment slot="lead">
				<AppRailAnchor href="/"
					><i class="fa-solid fa-bars fa-xl"></i></AppRailAnchor
				>
			</svelte:fragment>
			<AppRailAnchor href="/day1" selected={$page.url.pathname === '/day1'}>
				<svelte:fragment slot="lead"
					><i class="fa-solid fa-child"></i></svelte:fragment
				>
				<span>Day 1</span>
			</AppRailAnchor>
			<AppRailAnchor href="/day2" selected={$page.url.pathname === '/day2'}>
				<svelte:fragment slot="lead"
					><i class="fa-solid fa-cookie"></i></svelte:fragment
				>
				<span>Day 2</span>
			</AppRailAnchor>
			<AppRailAnchor href="/day22" selected={$page.url.pathname === '/day22'}>
				<svelte:fragment slot="lead"
					><i class="fa-solid fa-snowflake"></i></svelte:fragment
				>
				<span>Day 22</span>
			</AppRailAnchor>
			<AppRailAnchor href="/day23" selected={$page.url.pathname === '/day23'}>
				<svelte:fragment slot="lead"
					><i class="fa-solid fa-network-wired"></i></svelte:fragment
				>
				<span>Day 23</span>
			</AppRailAnchor>
			<AppRailAnchor href="/day24" selected={$page.url.pathname === '/day24'}>
				<svelte:fragment slot="lead"
					><i class="fa-solid fa-location-dot"></i></svelte:fragment
				>
				<span>Day 24</span>
			</AppRailAnchor>
			<svelte:fragment slot="trail">
				<AppRailAnchor
					href="https://github.com/constantinchik"
					target="_blank"
					title="Account"
					><i class="fa-brands fa-github fa-xl"></i></AppRailAnchor
				>
			</svelte:fragment>
		</AppRail>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
