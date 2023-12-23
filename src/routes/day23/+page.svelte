<script lang="ts">
	import type { PageData } from './$types';
	import ElfNetPost from './ElfNetPost.svelte';

	export let data: PageData;

	$: posts = data.posts.sort((a, b) =>
		a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0
	);
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">ElfNet Social</h1>

	{#if data.posts}
		{#each posts as post}
			<ElfNetPost {post} />
		{/each}
	{:else}
		<p>There was an error loading posts</p>
	{/if}
</div>
