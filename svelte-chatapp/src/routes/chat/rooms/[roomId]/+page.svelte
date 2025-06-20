<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import socket from '$lib/socket';
	import { formatTime, getUserIdFromToken } from '$lib/functions';

	let roomId = '';
	let userId: string | null = null;
	let content = '';
	let messages: any[] = [];

	function sendMessage() {
		if (content.trim()) {
			socket.emit('send_message', {
				userId,
				content,
				roomId
			});
			content = '';
		}
	}

	onMount(() => {
		console.log('privte chate');

		const token = localStorage.getItem('token');
		if (token) userId = getUserIdFromToken(token);

		roomId = get(page).params.roomId;

		// الانضمام إلى الغرفة
		socket.emit('join_room', { roomId });

		// استقبال الرسائل السابقة
		socket.off('messages_history');
		socket.on('messages_history', (data) => {
			messages = data;
		});

		// استقبال الرسائل الجديدة
		socket.off('new_message');
		socket.on('new_message', (msg) => {
			if (msg && msg.user) {
				messages = [...messages, msg];
			}
		});
	});
</script>

<div class="m-10 flex flex-1 flex-col rounded-lg bg-gray-400 p-4 text-gray-950 shadow">
	<div class="mb-4 flex-1 space-y-2 overflow-y-auto">
		{#each messages as msg}
			<div
				class="rounded p-2"
				class:bg-blue-200={msg.user.id === userId}
				class:bg-gray-200={msg.user.id !== userId}
			>
				<strong>{msg.user.username}</strong>
				<span class="ml-2 text-xs text-gray-600">{formatTime(msg.createdAt)}</span>
				<div>{msg.content}</div>
			</div>
		{/each}
	</div>

	<form class="flex gap-2" on:submit|preventDefault={sendMessage}>
		<input
			bind:value={content}
			class="flex-1 rounded-md bg-gray-200 px-3 py-2 outline-none"
			placeholder="اكتب رسالة..."
		/>
		<button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" type="submit">
			إرسال
		</button>
	</form>
</div>
