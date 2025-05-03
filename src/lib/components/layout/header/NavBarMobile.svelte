<script lang="ts">
	import { createCollapsible, createDialog, melt } from '@melt-ui/svelte';
	import Icon from '@iconify/svelte';
	import menuIcon from '@iconify-icons/material-symbols/menu-rounded';
	import closeIcon from '@iconify-icons/material-symbols/close-rounded';
	import { fade, fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import arrowDownIcon from '@iconify-icons/material-symbols/keyboard-arrow-down-rounded';
	import facebookIcon from '@iconify-icons/ic/round-facebook';

	export let services: ServiceItem[] = [];

	const {
		elements: { trigger, portalled, overlay, content, close },
		states: { open }
	} = createDialog();
	const {
		elements: { root: collapseRoot, content: collapseContent, trigger: collapseTrigger },
		states: { open: collapseOpen }
	} = createCollapsible({
		forceVisible: true
	});

	function closeBottomSheet() {
		open.set(false);
	}
</script>

<div class="menu menu-horizontal mr-2 h-10 items-center p-0 lg:hidden">
	<button type="button" class="btn btn-sm text-xl" use:melt={$trigger}>
		<Icon icon={menuIcon} />
	</button>
</div>
{#if $open}
	<div use:melt={$portalled} class="relative z-20 lg:hidden">
		<div
			use:melt={$overlay}
			class="fixed left-0 top-0 h-full w-full bg-black/50 backdrop-blur-sm"
			transition:fade={{ duration: 200 }}
		/>
		<div
			use:melt={$content}
			class="fixed bottom-0 left-0 w-full rounded-t-box border bg-white p-4 shadow-lg"
			transition:fly={{
				duration: 300,
				y: 350,
				easing: cubicOut
			}}
		>
			<div class="flex h-10 items-center justify-between">
				<div class="-my-1.5 p-1">
					<img class="h-11 w-auto" src="/images/web logo 2.webp" alt="logo" />
				</div>
				<button type="button" class="btn btn-square btn-sm" use:melt={$close}>
					<Icon icon={closeIcon} class="text-xl" />
				</button>
			</div>
			<ul class="menu mt-6 space-y-2 p-0">
				<li>
					<a href="/" class="py-3 font-semibold" on:click={closeBottomSheet}>Trang chủ</a>
				</li>
				<li
					use:melt={$collapseRoot}
					class="rounded-lg {$collapseOpen ? 'bg-base-content/5' : 'bg-transparent'}"
				>
					<button
						use:melt={$collapseTrigger}
						type="button"
						class="justify-between py-3 font-semibold"
					>
						Booking
						<Icon
							icon={arrowDownIcon}
							class="{$collapseOpen ? 'rotate-180' : ''} transition-transform"
						/>
					</button>
					{#if $collapseOpen}
						<ul
							use:melt={$collapseContent}
							transition:slide
							class="m-0 mx-2 space-y-2 border-t px-0 py-2 before:hidden"
						>
							{#each services as service (service)}
								<li>
									<button
										type="button"
										class="group flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3"
									>
										<div
											class="flex size-11 flex-shrink-0 items-center justify-center rounded-lg bg-base-content/5 bg-white text-2xl group-active:!bg-white/10"
										>
											<Icon icon={service.icon} font-size={service.sizeInPx} />
										</div>
										<div>
											<p class="font-semibold">{service.name}</p>
											<p class="mt-1 text-wrap text-xs font-medium opacity-60">
												{service.description}
											</p>
										</div>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
				<li>
					<a href="/view/album/DSDB53TG" class="py-3 font-semibold" on:click={closeBottomSheet}>Album</a>
				</li>
				<li>
					<a href="#" class="py-3 font-semibold" on:click={closeBottomSheet}>Về chúng tôi</a>
				</li>
			</ul>
			<a
				href="https://www.facebook.com/profile.php?id=61563584855748"
				target="_blank"
				class="ml-auto mt-4 block w-fit"
			>
				<Icon icon={facebookIcon} class="size-7" />
			</a>
		</div>
	</div>
{/if}
