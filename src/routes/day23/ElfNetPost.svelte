<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { ElfPost } from './+page.ts';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import ElfNetComment from './ElfNetComment.svelte';

	dayjs.extend(relativeTime);

	export let post: ElfPost;

	$: initials = post.author
		.split(' ')
		.map((name) => name[0])
		.slice(0, 2)
		.join('');
	$: postTime = dayjs(post.timestamp).fromNow();
	$: comments = post.comments.sort((a, b) =>
		a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0
	);

	function like() {
		post.likes++;
		post.liked = true;
	}

	function unlike() {
		post.likes--;
		post.liked = false;
	}

	let comment = '';
	function postComment() {
		post.comments = [
			...post.comments,
			{
				id: 'asdf',
				author: 'You',
				timestamp: dayjs().toISOString(),
				content: comment,
				likes: 0
			}
		];
		comment = '';
	}

	let commentsExpanded = false;
</script>

<div class="card card-hover">
	<header class="card-header flex items-center gap-4 font-bold">
		<Avatar {initials} width="w-11" />
		<div class="flex flex-col">
			<p>{post.author}</p>
			<p class="text-sm text-gray-500">{postTime}</p>
		</div>
	</header>
	<section class="p-8">
		<p>{post.content}</p>
	</section>
	<footer class="card-footer p-4 pt-0">
		<button
			type="button"
			class="btn btn-sm gap-2"
			class:variant-filled-primary={post.liked}
			on:click={() => (post.liked ? unlike() : like())}
		>
			<i class="fa-solid fa-heart"></i>
			{post.likes}
		</button>
		<button
			type="button"
			class="btn btn-sm gap-2"
			class:variant-filled-primary={commentsExpanded}
			on:click={() => (commentsExpanded = !commentsExpanded)}
		>
			<i class="fa-solid fa-comment"></i>
			{comments.length}
		</button>
	</footer>
	{#if commentsExpanded}
		<div class="bg-secondary-900 p-4">
			<form class="mb-6">
				<label class="label">
					<textarea
						class="textarea"
						rows="2"
						placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit."
						bind:value={comment}
					/>
				</label>
				<button class="btn variant-filled-primary mt-2" on:click={postComment}>
					Post comment
				</button>
			</form>
			{#each comments as comment}
				<ElfNetComment {comment} />
			{/each}
		</div>
	{/if}
</div>
