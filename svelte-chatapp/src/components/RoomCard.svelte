<script lang="ts">
	import { goto } from '$app/navigation';

	const props = $props();

	console.log('room prosp: ', props.data);
</script>

<main class="m-2 flex h-56 flex-col justify-between bg-gray-200 p-4">
	<h1 class="text-center text-2xl font-bold text-gray-800">{props.data.name}</h1>
	<button
		onclick={() => goto(`/chat/rooms/${props.data.id}`)}
		class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
	>
		Enter Chat Room</button
	>
</main>
