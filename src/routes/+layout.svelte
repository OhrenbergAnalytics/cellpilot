<script lang="ts">
	import './layout.css';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const formatLabel = (segment: string) => {
		const decoded = decodeURIComponent(segment);
		return decoded
			.split(/[-_]/)
			.filter(Boolean)
			.map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
			.join(' ');
	};

	const segments = $derived($page.url.pathname.split('/').filter(Boolean));
	const crumbs = $derived([
		{ label: 'Home', href: '/' },
		...segments.map((segment, idx) => {
			const href = `/${segments.slice(0, idx + 1).join('/')}`;
			return { label: formatLabel(segment), href };
		})
	]);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#each crumbs as crumb, idx (crumb.href)}
							<Breadcrumb.Item class="hidden md:block">
								{#if idx < crumbs.length - 1}
									<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
								{:else}
									<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
								{/if}
							</Breadcrumb.Item>
							{#if idx < crumbs.length - 1}
								<Breadcrumb.Separator class="hidden md:block" />
							{/if}
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<main class="flex flex-1 flex-col gap-4 p-4 pt-0">
			<section class="bg-muted/50 min-h-screen flex-1 rounded-xl p-6 md:min-h-min">
				{@render children()}
			</section>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
