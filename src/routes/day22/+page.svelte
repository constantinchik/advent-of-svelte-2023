<script lang="ts">
	import seedrandom from 'seedrandom';

	let name = '';

	const svgSize = 400;
	const strokeWidth = 4;
	// The configuration of the generator
	const generatorConfig = {
		trunkLength: [svgSize / 5, (svgSize / 2) * 0.9],
		branchNum: [2, 5],
		branchLength: [svgSize / 50, svgSize / 5], // Not the actual length, but the diff between start x and end x (same for y)
		branchDistance: [0, 100] // Percentage of trunk length
	};

	let svg: SVGElement;

	$: snowflake = generateSnowflake(name.toLowerCase());

	function randomInRange(rng: any, min: number, max: number) {
		return Math.round(rng() * (max - min) + min);
	}

	function generateSnowflake(seed: string) {
		const rng = seedrandom(seed);

		const trunkLength = randomInRange(
			rng,
			generatorConfig.trunkLength[0],
			generatorConfig.trunkLength[1]
		);
		const branchNum = randomInRange(
			rng,
			generatorConfig.branchNum[0],
			generatorConfig.branchNum[1]
		);

		return {
			trunkY2: svgSize / 2 - trunkLength,
			branches: Array(branchNum)
				.fill(0)
				.map(() => {
					const branchLength = randomInRange(
						rng,
						generatorConfig.branchLength[0],
						generatorConfig.branchLength[1]
					);
					const branchDistance = randomInRange(
						rng,
						generatorConfig.branchDistance[0],
						generatorConfig.branchDistance[1]
					);
					const y1 = svgSize / 2 - (branchDistance * trunkLength) / 100;
					return {
						y1: y1,
						x2: svgSize / 2 - branchLength,
						y2: y1 - branchLength
					};
				})
		};
	}

	function downloadSnowflake() {
		const svgData = new XMLSerializer()
			.serializeToString(svg)
			.replace('stroke="white"', 'stroke="lightblue"');
		const svgBlob = new Blob([svgData], {
			type: 'image/svg+xml;charset=utf-8'
		});
		const svgUrl = URL.createObjectURL(svgBlob);
		const downloadLink = document.createElement('a');
		downloadLink.href = svgUrl;
		downloadLink.download = `${name || 'empty'}-snowflake.svg`;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Snowflake Silhouettes</h1>

	<label class="label">
		<span>Input your name to get personal snowflake</span>
		<input
			class="input"
			type="text"
			placeholder="Your name..."
			bind:value={name}
		/>
	</label>

	<svg
		viewBox="0 0 {svgSize} {svgSize}"
		width={svgSize}
		height={svgSize}
		role="img"
		bind:this={svg}
	>
		<defs>
			<style type="text/css">
				.flipped-half-branch {
					scale: -1 1;
					transform-origin: center;
				}
				.rotated-branch {
					rotate: calc(60deg * var(--index));
					transform-origin: center;
				}
			</style>
		</defs>

		<title>A Snowflake</title>

		<g id="branch">
			<g id="half-branch" stroke="white" stroke-width={strokeWidth}>
				<line
					x1={svgSize / 2}
					y1={svgSize / 2}
					x2={svgSize / 2}
					y2={snowflake.trunkY2}
					class="trunk"
				/>
				{#each snowflake.branches as branch}
					<line
						x1={svgSize / 2}
						y1={branch.y1}
						x2={branch.x2}
						y2={branch.y2}
						class="branch"
					/>
				{/each}
			</g>
			<use href="#half-branch" class="flipped-half-branch" />
		</g>

		<!-- Copy our tree -->
		<use href="#branch" style="--index: 1;" class="rotated-branch" />
		<use href="#branch" style="--index: 2;" class="rotated-branch" />
		<use href="#branch" style="--index: 3;" class="rotated-branch" />
		<use href="#branch" style="--index: 4;" class="rotated-branch" />
		<use href="#branch" style="--index: 5;" class="rotated-branch" />
	</svg>

	<div class="w-full flex">
		<button
			class="btn variant-filled-primary mx-auto"
			on:click={downloadSnowflake}>Download as SVG</button
		>
	</div>
</div>

<style lang="postcss">
	/* Give our SVG wrapper a blue background */
	svg {
		margin-left: auto;
		margin-right: auto;
		width: 400px;
		height: 400px;
		min-width: 400px;
		min-height: 400px;
	}
</style>
