<!-- src/routes/celldatabase/+page.svelte -->
<script lang="ts">
	import DataTable from './data-table.svelte';
	import { columns } from './column.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<DataTable data={data.cells} {columns} />
