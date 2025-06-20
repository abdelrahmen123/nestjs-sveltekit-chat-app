<script>
	import { goto } from '$app/navigation';
	import { token } from '$lib/stores/auth.store';

	const handleLogout = () => {
		localStorage.removeItem('token');
		token.set(null);
		goto('/auth/login');
	};
</script>

<nav class="flex flex-col bg-gray-800 px-7 py-2 shadow">
	<h1 class="mt-4 mb-6 text-center text-2xl font-bold text-gray-300">Chat App</h1>
	<ul class="mb-3 flex flex-1 flex-row justify-around">
		{#if $token !== null}
			<li>
				<a
					class="text-3xs cursor-pointer rounded bg-blue-500 px-2 py-2 font-semibold text-white hover:bg-blue-700"
					href="/">Home</a
				>
			</li>
			<li>
				<a
					class="text-3xs cursor-pointer rounded bg-blue-500 px-2 py-2 font-semibold text-white hover:bg-blue-700"
					href="/chat/public-room">Public Chat</a
				>
			</li>

			<li>
				<button
					on:click={handleLogout}
					class="text-3xs cursor-pointer rounded bg-red-500 px-2 py-2 font-semibold text-white hover:bg-red-700"
				>
					Logout
				</button>
			</li>
		{:else}
			<li>
				<a
					class="text-3xs cursor-pointer rounded bg-blue-500 px-2 py-2 font-semibold text-white hover:bg-blue-700"
					href="/auth/login">Login</a
				>
			</li>
			<li>
				<a
					class="text-3xs cursor-pointer rounded bg-blue-500 px-2 py-2 font-semibold text-white hover:bg-blue-700"
					href="/auth/register">Register</a
				>
			</li>
		{/if}
	</ul>
</nav>
