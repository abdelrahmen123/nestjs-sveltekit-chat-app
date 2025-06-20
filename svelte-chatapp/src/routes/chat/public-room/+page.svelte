<script lang="ts">
	import { formatTime, getUserIdFromToken } from '$lib/functions';
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';

	function sendMessage() {
		if (content.trim()) {
			socket.emit('send_message', {
				userId,
				content,
				roomId: currentRoomId
			});
			content = '';
		}
	}

	let socket: Socket;
	let userId: string | null = null;
	let content: string = '';
	let messages: any[] = [];
	let currentRoomId: string = '';

	onMount(() => {
		const token = localStorage.getItem('token');
		if (token) {
			userId = getUserIdFromToken(token);
			console.log('id: ', userId);
		}

		socket = io('http://localhost:8000');

		socket.emit('join_public_room');

		socket.on('joined_room', (roomId) => {
			currentRoomId = roomId;
		});

		socket.on('messages_history', (data) => {
			messages = data;
		});

		socket.on('new_message', (msg) => {
			messages = [...messages, msg];
		});
	});
</script>

<div class="m-10 flex flex-1 flex-col rounded-lg bg-gray-400 p-4 text-gray-950 shadow">
	<div class="mb-4 flex-1 space-y-2 overflow-y-scroll">
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
