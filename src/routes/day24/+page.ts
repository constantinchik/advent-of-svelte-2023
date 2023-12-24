import type { PageLoad } from './$types';

export const ssr = false;

export interface Coordinates {
	lat: number;
	lng: number;
}

export interface Destination {
	id: string; // unique identifier
	arrival: number; // arrival time in GMT
	departure: number; // arrival time in GMT
	population: number;
	presentsDelivered: number;
	city: string;
	region: string;
	location: Coordinates;
}

export interface SantaLocation {
	current?: Destination;
	next: Destination;
	history: Destination[];
}

async function getSantaData(fetch): Promise<SantaLocation> {
	try {
		const response = await fetch(
			'https://advent.sveltesociety.dev/data/2023/day-twenty-four.json'
		);
		if (response.ok) {
			return response.json();
		}
		return {};
	} catch (error) {
		console.error(error);
		return {};
	}
}

export const load: PageLoad = async ({ fetch }) => {
	return {
		santaLocation: await getSantaData(fetch)
	};
};
