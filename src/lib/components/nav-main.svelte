<script lang="ts">
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import type { Component, ComponentType, SvelteComponent } from "svelte";

	// Icon helper: allow Svelte components (class, factory, or `Component`), string paths, or default exports from SVG modules
	type IconLike =
		| ComponentType
		| typeof SvelteComponent
		| Component
		| string
		| {
				default: ComponentType | typeof SvelteComponent | Component | string;
		  };

	type NavItem = {
		title: string;
		url: string;
		icon: IconLike;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	};

	let { items }: { items: NavItem[] } = $props();

	const resolveIcon = (icon: IconLike) => {
		if (typeof icon === "string") {
			return { kind: "img" as const, value: icon };
		}
		if (typeof icon === "function") {
			return { kind: "component" as const, value: icon };
		}
		if (icon && typeof icon === "object" && "default" in icon) {
			const value = icon.default;
			if (typeof value === "string") {
				return { kind: "img" as const, value };
			}
			if (typeof value === "function") {
				return { kind: "component" as const, value };
			}
		}
		return { kind: "none" as const };
	};
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel></Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			<Collapsible.Root open={mainItem.isActive}>
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Sidebar.MenuButton tooltipContent={mainItem.title}>
							{#snippet child({ props })}
								{@const icon = resolveIcon(mainItem.icon)}
								<a href={mainItem.url} {...props}>
									{#if icon.kind === "img"}
										<img src={icon.value} alt={mainItem.title} class="size-4" />
									{:else if icon.kind === "component"}
										<svelte:component this={icon.value} class="size-4" />
									{:else}
										<span class="size-4" aria-hidden="true"></span>
									{/if}
									<span>{mainItem.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						{#if mainItem.items?.length}
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuAction
										{...props}
										class="data-[state=open]:rotate-90"
									>
										<ChevronRightIcon />
										<span class="sr-only">Toggle</span>
									</Sidebar.MenuAction>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content>
								<Sidebar.MenuSub>
									{#each mainItem.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton href={subItem.url}>
												<span>{subItem.title}</span>
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						{/if}
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
