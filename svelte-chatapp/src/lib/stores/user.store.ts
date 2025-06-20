import { derived, writable } from 'svelte/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const user = writable<any>(null);

export const friends = derived(user, ($user) => {
	if (!$user) {
		return [];
	}

	const allFriends = [
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...$user.friends.map((f: { friend: any }) => f.friend),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...$user.friendsOf.map((f: { user: any }) => f.user)
	];
	return allFriends;
});
