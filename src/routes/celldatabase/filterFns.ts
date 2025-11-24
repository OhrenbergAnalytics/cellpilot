// src/routes/celldatabase/filterFns.ts
import type { FilterFn } from '@tanstack/table-core';

// Exact-Match für Dropdowns (manufacturer, cell_format)
export const equalsString: FilterFn<any> = (row, columnId, filterValue) => {
    if (!filterValue) return true;
    const value = row.getValue<string | null>(columnId);
    if (value == null) return false;
    return String(value).toLowerCase() === String(filterValue).toLowerCase();
};

// Range-Filter für numerische Spalten (Min/Max)
// filterValue: [minString, maxString]
export const numberRange: FilterFn<any> = (row, columnId, filterValue) => {
    if (!filterValue) return true;

    const [minRaw, maxRaw] = (filterValue as [string | undefined, string | undefined]) ?? [
        undefined,
        undefined
    ];

    const valueRaw = row.getValue<number | string | null>(columnId);
    if (valueRaw == null || valueRaw === '') return false;

    const value =
        typeof valueRaw === 'number'
            ? valueRaw
            : parseFloat(String(valueRaw).replace(',', '.'));

    if (Number.isNaN(value)) return false;

    const min =
        minRaw !== undefined && minRaw !== ''
            ? parseFloat(minRaw.replace(',', '.'))
            : undefined;
    const max =
        maxRaw !== undefined && maxRaw !== ''
            ? parseFloat(maxRaw.replace(',', '.'))
            : undefined;

    if (min !== undefined && !Number.isNaN(min) && value < min) return false;
    if (max !== undefined && !Number.isNaN(max) && value > max) return false;

    return true;
};
