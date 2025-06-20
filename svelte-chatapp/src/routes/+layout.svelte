<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Chat App</title>
</svelte:head>

<main class="flex min-h-screen flex-col">

	{@render children()}

</main>
