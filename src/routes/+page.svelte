<script lang="ts">
	import { goto } from '$app/navigation';

	let albumId = '';

	$: clickable = albumId.trim() !== '';
</script>

<div class="mt-60 flex flex-col items-center justify-center gap-4">
	<input
		type="text"
		placeholder="Nhập album ID"
		class="input input-bordered"
		bind:value={albumId}
	/>
	<button
		class="btn btn-wide bg-primary text-white"
		on:click={() => {
			goto(`/view/album/${albumId}`);
		}}
		disabled={!clickable}
	>
		Mở album
	</button>
</div>

