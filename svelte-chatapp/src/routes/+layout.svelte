<script lang="ts">
	import toast, { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Navbar from '../components/Navbar.svelte';
	import { onMount } from 'svelte';
	import { token } from '$lib/stores/auth.store';
	import { url } from '$lib/constants/url';
	import { user } from '$lib/stores/user.store';
	import { goto } from '$app/navigation';

	let { children } = $props();

	onMount(async () => {
		const savedToken = localStorage.getItem('token');

		if (savedToken) {
			token.set(savedToken);
		}
	});
</script>

<svelte:head>
	<title>Chat App</title>
</svelte:head>

<main class="flex min-h-screen flex-col">
	<Navbar />
	<Toaster />

	{@render children()}

	<Footer />
</main>
