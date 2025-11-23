<script lang="ts">
	// shadcn/ui Components
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button/index.js';

	type Inquiry = {
		id: string;
		company: string;
		contact: string;
		email: string;
		subject: string;
		date: string;
		teaser: string;
		details: string;
	};

	// später kommen hier deine echten Inquiries / Supabase-Daten hin
	const dummyInquiries: Inquiry[] = [
		{
			id: 'inq-1',
			company: 'Acme Inc.',
			contact: 'William Smith',
			email: 'williamsmith@example.com',
			subject: '48V Pack für AGV',
			date: 'Heute, 09:34',
			teaser: 'Wir benötigen ein 48V Pack mit ca. 5 kWh für ein AGV...',
			details:
				'Hier stehen später die technischen Details der Inquiry: Spannung, Strom, Kapazität, Anwendung, Umgebung usw.'
		},
		{
			id: 'inq-2',
			company: 'Battery Labs',
			contact: 'Alice Smith',
			email: 'alice@example.com',
			subject: 'Re: Projekt Update',
			date: 'Gestern',
			teaser: 'Danke für das Update. Wir hätten noch Fragen zu den Zellen...',
			details: 'Weitere technischen Infos, Konfiguration, Status, Notizen, Links zum Konfigurator…'
		},
		{
			id: 'inq-3',
			company: 'Battery Labs',
			contact: 'Alice Smith',
			email: 'alice@example.com',
			subject: 'Re: Projekt Update',
			date: 'Gestern',
			teaser: 'Danke für das Update. Wir hätten noch Fragen zu den Zellen...',
			details: 'Weitere technischen Infos, Konfiguration, Status, Notizen, Links zum Konfigurator…'
		}
		// …weitere Dummies
	];

	let search = '';
	let selected: Inquiry | null = dummyInquiries[0];

	$: filteredInquiries =
		search.trim().length === 0
			? dummyInquiries
			: dummyInquiries.filter((inq: Inquiry) =>
					(inq.company + inq.contact + inq.subject).toLowerCase().includes(search.toLowerCase())
				);

	function selectInquiry(inq: Inquiry) {
		selected = inq;
	}
</script>

<!-- GANZE PAGE: in deinem bestehenden Layout-Slot -->
<div class="flex h-full min-h-0 flex-col gap-4">
	<!-- TOP-LEISTE: links Suche, rechts Buttons, alles auf einer Höhe -->
	<div class="flex items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<Input class="h-8 w-[220px]" placeholder="Search…" bind:value={search} />
		</div>

		<!-- Buttons auf der rechten Seite -->
		<div class="flex gap-2">
			<Button>Open in Configurator</Button>
			<Button variant="outline">Open Export PDF</Button>
		</div>
	</div>

	<!-- INHALT DARUNTER: 2 Spalten -->
	<div class="flex min-h-0 flex-1 gap-4">
		<!-- LINKE SPALTE: Liste -->
		<div class="flex min-h-0 w-[360px] flex-col">
			<ScrollArea class="flex-1">
				<div class="flex flex-col">
					{#each filteredInquiries as inq (inq.id + inq.subject)}
						<button
							type="button"
							on:click={() => selectInquiry(inq)}
							class={`flex flex-col items-start gap-1 border-b px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted/70 ${
								selected?.id === inq.id && selected?.subject === inq.subject ? 'bg-muted' : ''
							}`}
						>
							<div class="flex w-full items-center gap-2">
								<span class="font-medium">{inq.company}</span>
								<span class="ms-auto text-[11px] text-muted-foreground">
									{inq.date}
								</span>
							</div>
							<span class="text-xs text-muted-foreground">
								{inq.contact} · {inq.email}
							</span>
							<span class="line-clamp-1 text-xs font-semibold">
								{inq.subject}
							</span>
							<span class="line-clamp-2 text-[11px] text-muted-foreground">
								{inq.teaser}
							</span>
						</button>
					{/each}
				</div>
			</ScrollArea>
		</div>

		<Separator orientation="vertical" class="mx-2" />

		<!-- RECHTE SPALTE: Details -->
		<div class="flex min-h-0 flex-1 flex-col">
			{#if selected}
				<div class="mb-2">
					<h2 class="text-lg font-semibold">{selected.subject}</h2>
					<p class="text-sm text-muted-foreground">
						{selected.company} — {selected.contact} ({selected.email})
					</p>
				</div>

				<Separator class="mb-3" />

				<ScrollArea class="flex-1">
					<div class="prose prose-sm dark:prose-invert max-w-none">
						<p>{selected.details}</p>
						<p class="mt-4 text-xs text-muted-foreground">
							Hier kommen später die technischen Details zur Inquiry hin: Zielspannung, Kapazität,
							Strom, Use-Case, Umgebung, Status im Sales-Funnel, Verknüpfung zu gespeicherten
							Konfigurator-Entwürfen usw.
						</p>
					</div>
				</ScrollArea>
			{:else}
				<div class="flex h-full items-center justify-center text-sm text-muted-foreground">
					Bitte eine Inquiry in der Liste links auswählen.
				</div>
			{/if}
		</div>
	</div>
</div>
