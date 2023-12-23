<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { Comment } from './+page.ts';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(relativeTime);

	export let comment: Comment;

	$: initials = comment.author
		.split(' ')
		.map((name) => name[0])
		.join('');
	$: postTime = dayjs(comment.timestamp).fromNow();

	function like() {
		comment.likes++;
		comment.liked = true;
	}

	function unlike() {
		comment.likes--;
		comment.liked = false;
	}
</script>

<div class="card mb-2">
	<header class="card-header flex items-center gap-4 font-bold">
		<Avatar {initials} width="w-9" />
		<div class="flex flex-col">
			<p class="text-sm">{comment.author}</p>
			<p class="text-xs text-gray-500">{postTime}</p>
		</div>
	</header>
	<section class="p-4">
		<p>{comment.content}</p>
	</section>
	<footer class="card-footer p-4 pt-0">
		<button
			type="button"
			class="btn btn-sm gap-2"
			class:variant-filled-primary={comment.liked}
			on:click={() => (comment.liked ? unlike() : like())}
		>
			<i class="fa-solid fa-heart"></i>
			{comment.likes}
		</button>
	</footer>
</div>
