<script lang="ts">
	import type { LoginFormData } from '$lib/types/form';
	import toast from 'svelte-french-toast';
	import { loginSchema } from '../(validations)/loginSchema';
	import { url } from '$lib/constants/url';
	import { goto } from '$app/navigation';
	import { token } from '$lib/stores/auth.store';
	import socket from '$lib/socket';

	let fromData: LoginFormData = {
		email: '',
		password: ''
	};

	const handleLogin = async (e: Event) => {
		e.preventDefault();

		const result = loginSchema.safeParse(fromData);

		if (!result.success) {
			result.error?.errors.forEach((error) => {
				toast.error(error.message);
			});
			return;
		}

		try {
			const response = await fetch(`${url}/api/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: fromData.email,
					password: fromData.password
				})
			});

			console.log(response);

			if (!response.ok) {
				toast.error('Something went wrong');
			}

			const data = await response.json();
			console.log(data);

			if (data.status >= 400) {
				toast.error(data.message);
			} else {
				localStorage.setItem('token', data.access_token);
				token.set(data.access_token);
				toast.success(data.message);
				goto('/');
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};
</script>

<form on:submit={handleLogin} class="mt-12 flex flex-col gap-10 rounded-md bg-gray-500 px-6">
	<h1 class="mt-6 h-12 rounded-md p-2 text-center text-2xl font-bold">Login</h1>
	<input
		class="rounded-md bg-gray-200 p-3 text-gray-900"
		type="email"
		placeholder="Email"
		bind:value={fromData.email}
	/>
	<input
		class="rounded-md bg-gray-200 p-3 text-gray-900"
		type="password"
		placeholder="Password"
		bind:value={fromData.password}
	/>
	<button class="mb-6 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
		Login
	</button>
</form>
