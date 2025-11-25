<!-- src/routes/celldatabase/data-table.svelte -->
<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		type VisibilityState,
		type RowSelectionState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import star from '$lib/assets/star.svg';
	import copy from '$lib/assets/copy.svg';
	import delete_icon from '$lib/assets/delete.svg';
	import edit from '$lib/assets/edit.svg';
	import info from '$lib/assets/info.svg';

	type DataTableProps<TData, TValue> = {
		data: TData[];
		columns: ColumnDef<TData, TValue>[];
	};

	let { data, columns }: DataTableProps<TData, TValue> = $props();

	// max. 8 Rows pro Seite
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 8 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({
		// sichtbar
		manufacturer: true,
		model: true,
		cell_format: true,
		capacity_ah: true,
		voltage_nominal_v: true,

		// standardmäßig versteckt, aber über Columns-Button aktivierbar
		chemistry: false,
		mass_g: false,
		energy_wh: false,
		voltage_min_v: false,
		voltage_max_v: false,
		current_max_charge_a: false,
		current_max_discharge_a: false,
		internal_resistance__initial_mohm: false,
		charge_discharge_cycles: false,
		capacity_retention: false,
		temperature_oparating_min_celcius: false,
		temperature_oparating_max_celcius: false
	});

	let rowSelection = $state<RowSelectionState>({});

	// Unique Values für Dropdowns (Manufacturer, Format, Chemistry)
	const manufacturers = $derived(
		Array.from(
			new Set(
				(data ?? []).map((row: any) => row?.manufacturer as string | undefined).filter(Boolean)
			)
		).sort()
	);

	const formats = $derived(
		Array.from(
			new Set(
				(data ?? []).map((row: any) => row?.cell_format as string | undefined).filter(Boolean)
			)
		).sort()
	);

	const chemistries = $derived(
		Array.from(
			new Set((data ?? []).map((row: any) => row?.chemistry as string | undefined).filter(Boolean))
		).sort()
	);

	// Columns, die als Range-Filter (min/max) behandelt werden
	const rangeFilterColumns = [
		'capacity_ah',
		'voltage_nominal_v',
		'mass_g',
		'energy_wh',
		'voltage_min_v',
		'voltage_max_v',
		'current_max_charge_a',
		'current_max_discharge_a',
		'internal_resistance__initial_mohm',
		'charge_discharge_cycles',
		'capacity_retention',
		'temperature_oparating_min_celcius',
		'temperature_oparating_max_celcius'
	];

	// Spalten, die linksbündig bleiben sollen (Text)
	const leftAlignedColumns = ['manufacturer', 'model', 'cell_format', 'chemistry'];

	// Checkbox-Spalte(n) (Selection)
	const checkboxColumnIds = ['select', '__select__'];

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		enableColumnFilters: true, // global aktiv, Columns regeln Details

		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});

	function resetAllFilters() {
		// Reset TanStack filter state
		columnFilters = [];

		// Reset visible column filter values
		table.getAllLeafColumns().forEach((col) => {
			if (col.getCanFilter()) {
				col.setFilterValue(undefined);
			}
		});
	}
</script>

<div>
	<div class="flex items-center justify-between pt-0 pb-2">
		<!-- LINKS: Add + Reset -->
		<div class="flex items-center gap-2">
			<Button size="sm">+ Add new Cell</Button>
		</div>

		<!-- RECHTS: Columns Dropdown -->
		<div>
			<ButtonGroup.Root>
				<Button size="sm" variant="outline" onclick={resetAllFilters}>Reset Filters</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" size="sm">
								Columns
								<ChevronDownIcon class="mr-1 h-4 w-4" />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
							<DropdownMenu.CheckboxItem
								class="capitalize"
								bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
							>
								{(column.columnDef.meta as { label?: string })?.label ?? column.id}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</ButtonGroup.Root>
		</div>
	</div>

	<div class="rounded-md border pr-3">
		<Table.Root class="w-full min-w-full">
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<!-- Header-Zeile -->
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								colspan={header.colSpan}
								class={`
									${checkboxColumnIds.includes(header.column.id) ? 'w-[40px] px-0 text-center' : ''}
									${leftAlignedColumns.includes(header.column.id as string) ? 'text-left' : 'text-right'}
									[&:has([role=checkbox])]:ps-3
								`}
							>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>

					<!-- Filter-Zeile -->
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								class={`
									py-1 
									${checkboxColumnIds.includes(header.column.id) ? 'w-[36px] px-0' : ''}
									${leftAlignedColumns.includes(header.column.id as string) ? 'text-left' : 'text-right'}
								`}
							>
								{#if !header.isPlaceholder && header.column.getCanFilter()}
									{#if header.column.id === 'manufacturer'}
										<!-- Manufacturer Filter: shadcn Dropdown -->
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												{#snippet child({ props })}
													<Button
														{...props}
														variant="outline"
														class="h-7 max-w-[140px] truncate px-2 text-[10px]"
													>
														<span class="truncate">
															{#if header.column.getFilterValue()}
																{header.column.getFilterValue() as string}
															{:else}
																All manufacturers
															{/if}
														</span>
														<ChevronDownIcon class="h-3 w-3" />
													</Button>
												{/snippet}
											</DropdownMenu.Trigger>
											<DropdownMenu.Content
												align="start"
												class="max-h-56 min-w-[160px] overflow-y-auto"
											>
												<DropdownMenu.Item>
													<button
														type="button"
														class="w-full px-2 py-1 text-left text-xs"
														onclick={() => header.column.setFilterValue(undefined)}
													>
														All manufacturers
													</button>
												</DropdownMenu.Item>
												<DropdownMenu.Separator />
												{#each manufacturers as m}
													<DropdownMenu.Item>
														<button
															type="button"
															class="w-full px-2 py-1 text-left text-xs"
															onclick={() => header.column.setFilterValue(m)}
														>
															{m}
														</button>
													</DropdownMenu.Item>
												{/each}
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									{:else if header.column.id === 'chemistry'}
										<!-- Chemistry Filter: shadcn Dropdown -->
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												{#snippet child({ props })}
													<Button
														{...props}
														variant="outline"
														class="h-7 max-w-[140px] truncate px-2 text-[10px]"
													>
														<span class="truncate">
															{#if header.column.getFilterValue()}
																{header.column.getFilterValue() as string}
															{:else}
																All chemistries
															{/if}
														</span>
														<ChevronDownIcon class="h-3 w-3" />
													</Button>
												{/snippet}
											</DropdownMenu.Trigger>
											<DropdownMenu.Content
												align="start"
												class="max-h-56 min-w-[160px] overflow-y-auto"
											>
												<DropdownMenu.Item>
													<button
														type="button"
														class="w-full px-2 py-1 text-left text-xs"
														onclick={() => header.column.setFilterValue(undefined)}
													>
														All chemistries
													</button>
												</DropdownMenu.Item>
												<DropdownMenu.Separator />
												{#each chemistries as c}
													<DropdownMenu.Item>
														<button
															type="button"
															class="w-full px-2 py-1 text-left text-xs"
															onclick={() => header.column.setFilterValue(c)}
														>
															{c}
														</button>
													</DropdownMenu.Item>
												{/each}
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									{:else if header.column.id === 'model'}
										<!-- Model Text-Filter -->
										<input
											placeholder="Search Models..."
											class="h-7 max-w-[110px] rounded-md border px-1 text-[10px]"
											value={(header.column.getFilterValue() as string) ?? ''}
											oninput={(e) =>
												header.column.setFilterValue((e.target as HTMLInputElement).value)}
										/>
									{:else if header.column.id === 'cell_format'}
										<!-- Format Filter: shadcn Dropdown -->
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												{#snippet child({ props })}
													<Button
														{...props}
														variant="outline"
														class="h-7 max-w-[120px] truncate px-2 text-[10px]"
													>
														<span class="truncate">
															{#if header.column.getFilterValue()}
																{header.column.getFilterValue() as string}
															{:else}
																All formats
															{/if}
														</span>
														<ChevronDownIcon class="h-3 w-3" />
													</Button>
												{/snippet}
											</DropdownMenu.Trigger>
											<DropdownMenu.Content
												align="start"
												class="max-h-56 min-w-[140px] overflow-y-auto"
											>
												<DropdownMenu.Item>
													<button
														type="button"
														class="w-full px-2 py-1 text-left text-xs"
														onclick={() => header.column.setFilterValue(undefined)}
													>
														All formats
													</button>
												</DropdownMenu.Item>
												<DropdownMenu.Separator />
												{#each formats as f}
													<DropdownMenu.Item>
														<button
															type="button"
															class="w-full px-2 py-1 text-left text-xs"
															onclick={() => header.column.setFilterValue(f)}
														>
															{f}
														</button>
													</DropdownMenu.Item>
												{/each}
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									{:else if rangeFilterColumns.includes(header.column.id as string)}
										<!-- rechtsbündig: Block an den rechten Rand -->
										<div class="ml-auto flex w-fit items-center justify-end gap-1">
											<input
												type="number"
												placeholder="Min"
												class="h-7 max-w-[55px] rounded-md border px-1 text-[10px]"
												value={(
													header.column.getFilterValue() as [string, string] | undefined
												)?.[0] ?? ''}
												oninput={(e) => {
													const rawMin = (e.target as HTMLInputElement).value;
													const current = (header.column.getFilterValue() as
														| [string, string]
														| undefined) ?? ['', ''];
													const rawMax = current[1];

													// parse numbers, allow empty
													const min = rawMin === '' ? null : parseFloat(rawMin);
													const max = rawMax === '' ? null : parseFloat(rawMax);

													// sort logic:
													let realMin = min;
													let realMax = max;

													if (min !== null && max !== null && min > max) {
														// swap
														realMin = max;
														realMax = min;
													}

													header.column.setFilterValue([
														realMin === null ? '' : String(realMin),
														realMax === null ? '' : String(realMax)
													]);
												}}
											/>
											<input
												type="number"
												placeholder="Max"
												class="h-7 max-w-[55px] rounded-md border px-1 text-[10px]"
												value={(
													header.column.getFilterValue() as [string, string] | undefined
												)?.[1] ?? ''}
												oninput={(e) => {
													const rawMax = (e.target as HTMLInputElement).value;
													const current = (header.column.getFilterValue() as
														| [string, string]
														| undefined) ?? ['', ''];
													const rawMin = current[0];

													const min = rawMin === '' ? null : parseFloat(rawMin);
													const max = rawMax === '' ? null : parseFloat(rawMax);

													let realMin = min;
													let realMax = max;

													if (min !== null && max !== null && min > max) {
														realMin = max;
														realMax = min;
													}

													header.column.setFilterValue([
														realMin === null ? '' : String(realMin),
														realMax === null ? '' : String(realMax)
													]);
												}}
											/>
										</div>
									{/if}
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<ContextMenu.Root>
						<ContextMenu.Trigger>
							{#snippet child({ props })}
								<Table.Row {...props} data-state={row.getIsSelected() && 'selected'}>
									{#each row.getVisibleCells() as cell (cell.id)}
										<Table.Cell
											class={`${
												checkboxColumnIds.includes(cell.column.id)
													? 'w-[36px] pl-2'
													: leftAlignedColumns.includes(cell.column.id as string)
														? 'px-2 text-left'
														: 'pr-2 text-right'
											}`}
										>
											<FlexRender
												content={cell.column.columnDef.cell}
												context={cell.getContext()}
											/>
										</Table.Cell>
									{/each}
								</Table.Row>
							{/snippet}
						</ContextMenu.Trigger>

						<ContextMenu.Content>
							<ContextMenu.Item
								onclick={() => {
									// Beispiel: Row-Daten verwenden
									const rowData = row.original as any;
									console.log('Edit', rowData);
									// hier z.B. ein Modal öffnen, Navigation, etc.
								}}
							>
								<img src={star} alt="star" class="h-4 w-4 opacity-70" />
								Favorite
							</ContextMenu.Item>
							<ContextMenu.Item
								onclick={() => {
									// Beispiel: Row-Daten verwenden
									const rowData = row.original as any;
									console.log('Edit', rowData);
									// hier z.B. ein Modal öffnen, Navigation, etc.
								}}
							>
								<img src={info} alt="info" class="h-4 w-4 opacity-70" />
								Details
							</ContextMenu.Item>

							<ContextMenu.Separator />
							<ContextMenu.Item
								onclick={() => {
									// Beispiel: Row-Daten verwenden
									const rowData = row.original as any;
									console.log('Edit', rowData);
									// hier z.B. ein Modal öffnen, Navigation, etc.
								}}
							>
								<img src={edit} alt="edit" class="h-4 w-4 opacity-70" />
								Edit cell
							</ContextMenu.Item>

							<ContextMenu.Item
								onclick={() => {
									const rowData = row.original as any;
									console.log('Duplicate', rowData);
								}}
							>
								<img src={copy} alt="copy" class="h-4 w-4 opacity-70" />
								Duplicate
							</ContextMenu.Item>
							<ContextMenu.Separator />
							<ContextMenu.Item
								onclick={() => {
									const rowData = row.original as any;
									console.log('Delete', rowData);
								}}
							>
								<img src={delete_icon} alt="delete" class="h-4 w-4 opacity-70" />
								Delete
							</ContextMenu.Item>
						</ContextMenu.Content>
					</ContextMenu.Root>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="flex items-center justify-end space-x-2 pt-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{table.getFilteredSelectedRowModel().rows.length} of
			{table.getFilteredRowModel().rows.length} row(s) selected.
		</div>
		<div class="space-x-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Next
			</Button>
		</div>
	</div>
</div>
