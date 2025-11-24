// src/routes/celldatabase/columns.ts
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderSnippet, renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableCheckbox from "./data-table-checkbox.svelte";

export type Cells = {
    id: number;
    manufacturer: string | null;
    model: string | null;
    cell_format: string | null;
    mass_g: number | null;
    capacity_ah: number | null;
    energy_wh: number | null;
    voltage_nominal_v: number | null;
    voltage_min_v: number | null;
    voltage_max_v: number | null;
    current_max_charge_a: number | null;
    current_max_discharge_a: number | null;
    internal_resistance__initial_mohm: number | null;
    charge_discharge_cycles: number | null;
    capacity_retention: number | null;
    temperature_oparating_min_celcius: number | null;
    temperature_oparating_max_celcius: number | null;
    chemistry: string | null;
};

export const columns: ColumnDef<Cells>[] = [
    // Checkbox-Spalte
    {
        id: "select",
        header: ({ table }) =>
            renderComponent(DataTableCheckbox, {
                checked: table.getIsAllPageRowsSelected(),
                indeterminate:
                    table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
                onCheckedChange: (value: boolean) =>
                    table.toggleAllPageRowsSelected(!!value),
                "aria-label": "Select all"
            }),
        cell: ({ row }) =>
            renderComponent(DataTableCheckbox, {
                checked: row.getIsSelected(),
                onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
                "aria-label": "Select row"
            }),
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false
    },

    // Manufacturer
    {
        accessorKey: "manufacturer",
        header: "Manufacturer",
        meta: { label: "Manufacturer" },
        enableColumnFilter: true,
        filterFn: 'equalsString',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: string | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () => `<div>${value ?? "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.manufacturer
            });
        }
    },

    // Model
    {
        accessorKey: "model",
        header: "Model",
        meta: { label: "Model" },
        enableColumnFilter: true,
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: string | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () => `<div class="font-medium">${value ?? "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.model
            });
        }
    },

    // Format (18650 / 21700)
    {
        accessorKey: "cell_format",
        header: "Format",
        meta: { label: "Format" },
        enableColumnFilter: true,
        filterFn: 'equalsString',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: string | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () => `<div>${value ?? ""}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.cell_format
            });
        }
    },

    {
        accessorKey: "chemistry",
        header: "Chemistry",
        meta: { label: "Chemistry" },
        enableColumnFilter: true,
        filterFn: 'equalsString',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: string | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () => `<div>${value ?? ""}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.chemistry
            });
        }
    },

    // Mass [g]
    {
        accessorKey: "mass_g",
        header: () => {
            const snippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Mass [g]</div>`
            }));
            return renderSnippet(snippet);
        },
        meta: { label: "Mass [g]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.mass_g
            });
        }
    },

    // Capacity [Ah]
    {
        accessorKey: "capacity_ah",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Capacity [Ah]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Capacity [Ah]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value.toFixed(2) : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.capacity_ah
            });
        }
    },

    // Energy [Wh]
    {
        accessorKey: "energy_wh",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Energy [Wh]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Energy [Wh]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value.toFixed(2) : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.energy_wh
            });
        }
    },

    // Nominal Voltage [V]
    {
        accessorKey: "voltage_nominal_v",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Nominal Voltage [V]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Nominal Voltage [V]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value.toFixed(2) : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.voltage_nominal_v
            });
        }
    },

    // Min Voltage [V]
    {
        accessorKey: "voltage_min_v",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Min Voltage [V]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Min Voltage [V]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value.toFixed(2) : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.voltage_min_v
            });
        }
    },

    // Max Voltage [V]
    {
        accessorKey: "voltage_max_v",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Max Voltage [V]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Max Voltage [V]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value.toFixed(2) : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.voltage_max_v
            });
        }
    },

    // Max Charge Current [A]
    {
        accessorKey: "current_max_charge_a",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Max Charge Current [A]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Max Charge Current [A]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value.toFixed(1) : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.current_max_charge_a
            });
        }
    },

    // Max Discharge Current [A]
    {
        accessorKey: "current_max_discharge_a",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Max Discharge Current [A]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Max Discharge Current [A]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value.toFixed(1) : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.current_max_discharge_a
            });
        }
    },

    // Internal resistance [mΩ]
    {
        accessorKey: "internal_resistance__initial_mohm",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Internal Resistance [mΩ]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Internal Resistance [mΩ]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value.toFixed(2) : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.internal_resistance__initial_mohm
            });
        }
    },

    // Charge / Discharge cycles
    {
        accessorKey: "charge_discharge_cycles",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Charge/Discharge Cycles</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Charge/Discharge Cycles" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.charge_discharge_cycles
            });
        }
    },

    // Capacity retention [%]
    {
        accessorKey: "capacity_retention",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Capacity retention [%]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Capacity retention [%]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? `${value} %` : "-"
                        }</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.capacity_retention
            });
        }
    },

    // Min operating temp [°C]
    {
        accessorKey: "temperature_oparating_min_celcius",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Min Operating Temp. [°C]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Min Operating Temp. [°C]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.temperature_oparating_min_celcius
            });
        }
    },

    // Max operating temp [°C]
    {
        accessorKey: "temperature_oparating_max_celcius",
        header: () => {
            const headerSnippet = createRawSnippet(() => ({
                render: () => `<div class="text-end">Max Operating Temp. [°C]</div>`
            }));
            return renderSnippet(headerSnippet);
        },
        meta: { label: "Max Operating Temp. [°C]" },
        enableColumnFilter: true,
        filterFn: 'inNumberRange',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ value: number | null }]>((getValue) => {
                const { value } = getValue();
                return {
                    render: () =>
                        `<div class="text-end">${value != null ? value : "-"}</div>`
                };
            });

            return renderSnippet(snippet, {
                value: row.original.temperature_oparating_max_celcius
            });
        }
    },
];
