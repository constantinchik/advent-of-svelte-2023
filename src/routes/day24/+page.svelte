<script lang="ts">
	import {
		LeafletMap,
		TileLayer,
		Marker,
		DivIcon,
		Polyline,
		Tooltip,
		Circle
	} from 'svelte-leafletjs';
	import 'leaflet/dist/leaflet.css';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import type { Coordinates } from './+page';
	import dayjs from 'dayjs';

	// Map configuration
	const mapOptions = {
		center: [1.364917, 103.822872],
		zoom: 1
	};
	const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const tileLayerOptions = {
		minZoom: 0,
		maxZoom: 20,
		maxNativeZoom: 19,
		attribution: '© OpenStreetMap contributors'
	};

	let leafletMap;

	export let data: PageData;

	interface IPath {
		path: Coordinates[];
		timeTravelled: number;
	}

	$: paths = getPaths(data, currentLocation);
	$: history = data.santaLocation.history.map((history) => history);
	$: trail = [
		...data.santaLocation.history.map((history) => ({
			name: `${history.city} (${history.region})`,
			location: history.location,
			arrivedAt: history.arrival
		})),
		...(data.santaLocation.current
			? [
					{
						name: `${data.santaLocation.current.city} (${data.santaLocation.current.city})`,
						location: data.santaLocation.current.location,
						arrivedAt: data.santaLocation.current.arrival
					}
				]
			: [])
	].reverse();
	$: totalPresents =
		data.santaLocation.history.reduce(
			(acc, curr) => acc + curr.presentsDelivered,
			0
		) +
		(data.santaLocation.current
			? data.santaLocation.current.presentsDelivered
			: 0);

	let currentLocation: Coordinates;
	let inTransit = false;
	let progress = 0;
	let arrivingIn = 0;
	let timeToDeparture = 0;

	onMount(() => {
		updateCurrentLocation();
	});

	function getPaths(data: PageData, currentLocation?: Coordinates): IPath[] {
		const paths: IPath[] = [];
		for (let i = 0; i < data.santaLocation.history.length - 1; i++) {
			const from = data.santaLocation.history[i];
			const to = data.santaLocation.history[i + 1];
			// Hack to show the path to first location correctly
			if (to.location.lng < -170) {
				to.location.lng += 360;
			}
			paths.push({
				path: [from.location, to.location],
				timeTravelled: to.departure - from.departure
			});
		}
		if (currentLocation) {
			paths.push({
				path: [
					data.santaLocation.history[data.santaLocation.history.length - 1]
						.location,
					currentLocation
				],
				timeTravelled:
					Date.now() -
					data.santaLocation.history[data.santaLocation.history.length - 1]
						.departure
			});
		}
		return paths;
	}

	function flyTo(location: Coordinates) {
		leafletMap.getMap().flyTo(location, 10);
	}

	function updateCurrentLocation() {
		if (!data.santaLocation.current) {
			// Santa is in Transit
			inTransit = true;
			const prev =
				data.santaLocation.history[data.santaLocation.history.length - 1];
			const next = data.santaLocation.next;

			const now = Date.now();
			arrivingIn = next.arrival - now;
			progress = (now - prev.departure) / (next.arrival - prev.departure);

			if (progress > 1) {
				progress = 1;
				arrivingIn = 0;
				invalidateAll().then(() => {
					setTimeout(() => {
						updateCurrentLocation();
					}, 1000);
				});
				return;
			}

			currentLocation = {
				lat:
					prev.location.lat +
					(next.location.lat - prev.location.lat) * progress,
				lng:
					prev.location.lng + (next.location.lng - prev.location.lng) * progress
			};

			setTimeout(updateCurrentLocation, 1000);
			return;
		}

		// Santa is in a currentLocation
		currentLocation = data.santaLocation.current.location;
		inTransit = false;
		timeToDeparture =
			data.santaLocation.current.departure - new Date().getTime();
		if (timeToDeparture < 0) {
			timeToDeparture = 0;
			invalidateAll().then(() => {
				setTimeout(() => {
					updateCurrentLocation();
				}, 1000);
			});
			return;
		}
		setTimeout(updateCurrentLocation, 1000);
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Santa's Magical Tracker</h1>

	<div class="flex flex-wrap justify-center mt-10 gap-4">
		<div class="card card-hover p-4">
			<header class="card-header flex items-center gap-4 font-bold">
				<p>Total Presents delivered</p>
				<i class="fa-solid fa-gift" style="color: white"></i>
			</header>
			<section class="p-4">
				<h3>{totalPresents}</h3>
			</section>
		</div>
		<div class="card card-hover p-4">
			<header class="card-header flex items-center gap-4 font-bold">
				<p>Santa is currently</p>
				<i class="fa-solid fa-location-pin" style="color: white"></i>
			</header>
			<section class="p-4">
				{#if inTransit}
					<h3>
						In Transit to {data.santaLocation.next.city} ({data.santaLocation
							.next.region})
					</h3>
				{:else if data.santaLocation.current}
					<h3>
						In {data.santaLocation.current.city} ({data.santaLocation.current
							.region})
					</h3>
				{/if}
			</section>
		</div>
	</div>

	<h2 class="h2">Santa's Path:</h2>
	<div class="w-full flex gap-4 overflow-x-scroll">
		{#each trail as city}
			<button class="btn variant-filled" on:click={() => flyTo(city.location)}>
				{dayjs(city.arrivedAt).format('hh:mm A')} |
				{city.name}
			</button>
		{/each}
	</div>

	<h2 class="h2">Map:</h2>
	<div class="map-container">
		<LeafletMap bind:this={leafletMap} options={mapOptions}>
			<TileLayer url={tileUrl} options={tileLayerOptions} />
			{#if currentLocation}
				<Marker latLng={currentLocation}>
					<DivIcon>
						<!-- Does not work for some reasons... -->
						<img
							alt="Santa's location"
							style="width: 40px; transform: translate(-50%, -50%);"
							src="https://static.vecteezy.com/system/resources/previews/027/173/709/original/santa-claus-christmas-flat-icon-png.png"
						/>
					</DivIcon>
					<Tooltip>
						<b>
							Santa. <br />
							{#if inTransit}
								In Transit<br />
								Progress: {Math.round(progress * 10000) / 100}%<br />
								Arriving In: {Math.round(arrivingIn / 1000 / 60)} minutes
							{:else}
								Departing in: {Math.round(timeToDeparture / 1000 / 60)} minutes
							{/if}
						</b></Tooltip
					>
				</Marker>
			{/if}
			{#each paths as path}
				<Polyline latLngs={path.path}>
					<Tooltip>
						Traveled in {Math.round(path.timeTravelled / 1000 / 60)} minutes
					</Tooltip>
				</Polyline>
			{/each}
			{#each history as location}
				<Circle latLng={location.location} radius={2000}>
					<Tooltip>
						<p class="font-bold">
							{location.city} ({location.region})
						</p>
						<p>
							Santa was here from {dayjs(location.arrival).format('hh:mm A')} to
							{dayjs(location.departure).format('hh:mm A')}
						</p>
						<p>
							Santa delivered {location.presentsDelivered} presents here
						</p>
					</Tooltip>
				</Circle>
			{/each}
		</LeafletMap>
	</div>
</div>

<style lang="postcss">
	.map-container {
		height: 700px;
	}
</style>
