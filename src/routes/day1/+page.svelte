<script lang="ts">
	import { Table } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import type { Child } from './+page';

	export let data: PageData;

	$: childrenTableData = {
		head: ['Name', 'Tally', 'Is Nice'],
		body: data.children.map((child: Child) => [
			child.name,
			child.tally,
			child.tally > 0 ? 'Yes' : 'No'
		])
	};

	$: nicestChild =
		data.children &&
		data.children.reduce((a, b) => (a.tally > b.tally ? a : b));
	$: naughtiestChild =
		data.children &&
		data.children.reduce((a, b) => (a.tally < b.tally ? a : b));
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Naughty or Nice</h1>

	{#if data.children}
		<div class="flex flex-wrap justify-center mt-10 gap-4">
			<div class="card card-hover p-4">
				<header class="card-header flex items-center gap-4 font-bold">
					<p>Total Children</p>
					<i class="fa-solid fa-child" style="color: lightseagreen"></i>
				</header>
				<section class="p-4">
					<h3>{data.children.length}</h3>
				</section>
			</div>
			<div class="card card-hover p-4">
				<header class="card-header flex items-center gap-4 font-bold">
					<p>Nicest child</p>
					<i class="fa-solid fa-star" style="color: yellow"></i>
				</header>
				<section class="p-4">
					<h3>{nicestChild.name}</h3>
				</section>
			</div>
			<div class="card card-hover p-4">
				<header class="card-header flex items-center gap-4 font-bold">
					<p>Naughtiest child</p>
					<i class="fa-solid fa-poop" style="color: saddlebrown"></i>
				</header>
				<section class="p-4">
					<h3>{naughtiestChild.name}</h3>
				</section>
			</div>
		</div>

		<Table source={childrenTableData} />
	{:else}
		<p>There was an error loading children</p>
	{/if}
</div>
