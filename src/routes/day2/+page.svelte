<script lang="ts">
	let cookiesEaten = 0;

	function eatCookie() {
		cookiesEaten++;
	}

	function removeCookie() {
		cookiesEaten--;
		if (cookiesEaten < 0) {
			cookiesEaten = 0;
		}
	}

	function resetCookies() {
		cookiesEaten = 0;
	}
</script>

<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Cookie counter</h1>

	<h2 class="h2">Cookies eaten: {cookiesEaten}</h2>

	<button class="btn variant-filled-primary" on:click={eatCookie}
		>Eat a cookie</button
	>
	<button
		class="btn variant-filled-primary"
		disabled={cookiesEaten === 0}
		on:click={removeCookie}>Remove cookie</button
	>
	<button class="btn variant-filled-primary" on:click={resetCookies}
		>Reset</button
	>
</div>
