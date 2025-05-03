<script lang="ts">
	import Icon from '@iconify/svelte';
	import facebookIcon from '@iconify-icons/ic/round-facebook';
	import arrowDownIcon from '@iconify-icons/material-symbols/keyboard-arrow-down-rounded';
	import { createMenubar, melt } from '@melt-ui/svelte';

	export let services: ServiceItem[] = [];

	const {
		elements: { menubar },
		builders: { createMenu }
	} = createMenubar({ preventScroll: true });
	const {
		elements: { menu, item, trigger },
		states: { open }
	} = createMenu({ forceVisible: true });
</script>

<ul use:melt={$menubar} class="hidden gap-x-6 !p-0 lg:menu lg:menu-horizontal">
	<li>
		<a href="/" class="px-4 text-sm font-semibold leading-6">Trang chủ</a>
	</li>
	<li>
		<button use:melt={$trigger} class="px-4 text-sm font-semibold leading-6">
			Booking
			<Icon icon={arrowDownIcon} class="{$open ? 'rotate-180' : ''} transition-transform" />
		</button>
		<ul
			use:melt={$menu}
			class="z-10 hidden rounded-box border bg-white !p-4 text-sm shadow-lg lg:menu"
		>
			{#each services as service (service)}
				<li use:melt={$item} class="group">
					<button
						type="button"
						class="flex cursor-pointer items-center !gap-4 rounded-2xl p-4 leading-6 group-data-[highlighted]:bg-base-content/10"
					>
						<div
							class="flex size-11 items-center justify-center rounded-lg bg-base-content/5 text-2xl group-active:!bg-white/10 group-data-[highlighted]:bg-white"
						>
							<Icon icon={service.icon} font-size={service.sizeInPx} />
						</div>
						<div>
							<p class="font-semibold">{service.name}</p>
							<p class="mt-1 max-w-80 text-wrap font-medium opacity-60">{service.description}</p>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	</li>
	<li>
		<a href="/view/album/1" class="px-4 text-sm font-semibold leading-6">Album</a>
	</li>
	<li>
		<a href="#" class="px-4 text-sm font-semibold leading-6">Về chúng tôi</a>
	</li>
	<li>
		<div class="!rounded-none border-r-2 border-base-content !px-0"></div>
	</li>
	<li>
		<a href="https://www.facebook.com/profile.php?id=61563584855748" target="_blank">
			<Icon icon={facebookIcon} class="size-6" />
		</a>
	</li>
</ul>
