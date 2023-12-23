import type { PageLoad } from './$types';

export interface ElfPost {
	id: string;
	author: string;
	timestamp: string;
	content: string;
	likes: number;
	comments: Comment[];
	liked?: boolean;
}

export interface Comment {
	id: string;
	author: string;
	timestamp: string;
	content: string;
	likes: number;
	liked?: boolean;
}

async function getPosts(fetch): Promise<ElfPost[]> {
	try {
		const response = await fetch(
			'https://advent.sveltesociety.dev/data/2023/day-twenty-three.json'
		);
		if (response.ok) {
			return response.json();
		}
		return [];
	} catch (error) {
		console.error(error);
		return [];
	}
}

export const load: PageLoad = async ({ fetch }) => {
	return {
		posts: await getPosts(fetch)
	};
};
