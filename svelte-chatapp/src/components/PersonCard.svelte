<script lang="ts">
	import { io, Socket } from 'socket.io-client';
	import { goto } from '$app/navigation';
	import { getUserIdFromToken } from '$lib/functions';

	const props = $props();

	function startChat() {
		const token = localStorage.getItem('token');
		if (!token) return;

		const userId = getUserIdFromToken(token);
		if (!userId) return;

		const socket: Socket = io('http://localhost:8000', {
			auth: { userId }
		});

		socket.on('connect', () => {
			console.log('connected to socket');

			// تأكد من إزالة الاستماع القديم
			socket.off('private_chat_ready');
			socket.on('private_chat_ready', (data) => {
				console.log('Private room data:', data);
				goto(`/chat/rooms/${data.roomId}`);
			});

			socket.emit('start_private_chat', {
				targetUserId: props.data.id
			});
		});
	}
</script>

<div class="m-2 flex flex-col justify-between gap-10 rounded-md bg-gray-200 p-4">
	<h3 class="text-center text-2xl font-bold text-gray-800">{props.data.username}</h3>
	<button
		class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
		onclick={startChat}
	>
		Chat
	</button>
</div>
