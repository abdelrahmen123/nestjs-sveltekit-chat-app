<script lang="ts">
	import type { RegisterFormData } from '$lib/types/form';
	import toast from 'svelte-french-toast';
	import { registerSchema } from '../(validations)/registerSchema';
	import { url } from '$lib/constants/url';
	import { goto } from '$app/navigation';
	import { token } from '$lib/stores/auth.store';

	let fromData: RegisterFormData = {
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	};

	const handleRegister = async (e: Event) => {
		e.preventDefault();

		const result = registerSchema.safeParse(fromData);
		console.log(result);

		if (!result.success || fromData.password !== fromData.confirmPassword) {
			result.error?.errors.forEach((error) => {
				toast.error(error.message);
			});
			return;
		}

		try {
			const response = await fetch(`${url}/api/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: fromData.username,
					email: fromData.email,
					password: fromData.password
				})
			});

			if (!response.ok) {
				toast.error('Something went wrong');
			}

			const data = await response.json();

			if (data.statusCode >= 400) {
				toast.error(data.message);
			} else {
				toast.success(data.message);
				goto('/auth/login');
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};
</script>

<form
	on:submit={handleRegister}
	class="my-6 mb-20 flex flex-col gap-10 rounded-md bg-gray-500 px-6"
>
	<h1 class="mt-6 h-12 rounded-md p-2 text-center text-2xl font-bold">Register</h1>
	<input
		class="rounded-md bg-gray-200 p-3 text-gray-900"
		type="text"
		placeholder="Username"
		bind:value={fromData.username}
	/>
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
	<input
		class="rounded-md bg-gray-200 p-3 text-gray-900"
		type="password"
		placeholder="Confirm Password"
		bind:value={fromData.confirmPassword}
	/>
	<button class="mb-6 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
		Register
	</button>
</form>
