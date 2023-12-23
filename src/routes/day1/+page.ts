import type { PageLoad } from './$types';

export interface Child {
	name: string;
	tally: number;
}

async function getChildrenData(fetch): Promise<Child[]> {
	try {
		const response = await fetch(
			'https://advent.sveltesociety.dev/data/2023/day-one.json'
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
		children: await getChildrenData(fetch)
	};
};
