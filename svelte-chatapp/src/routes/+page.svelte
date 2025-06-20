<script lang="ts">
	import type { Unsubscriber } from 'svelte/store';
	import { onMount } from 'svelte';
	import { url } from '$lib/constants/url';
	import toast from 'svelte-french-toast';
	import { token } from '$lib/stores/auth.store';
	import PersonCard from '../components/PersonCard.svelte';

	let users = $state([]);
	let unsubscribe: Unsubscriber;

	onMount(() => {
		const fetchUsers = async (token: string) => {
			try {
				const response = await fetch(`${url}/api/user`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});

				const data = await response.json();

				if (data.statusCode >= 400) {
					toast.error(data.message);
				} else {
					users = data.users;
				}
			} catch (error) {
				console.error('Error fetching users:', error);
				toast.error('Something went wrong');
			}
		};

		unsubscribe = token.subscribe(async (token) => {
			if (token) {
				fetchUsers(token);
			}
		});

		return () => unsubscribe();
	});
</script>

<div class="grid flex-1 grid-cols-2 gap-4 overflow-scroll p-4">
	{#each users as user}
		<PersonCard data={user} />
	{/each}
</div>
