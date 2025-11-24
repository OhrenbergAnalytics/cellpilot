// src/routes/celldatabase/+page.server.ts
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

export const load: PageServerLoad = async () => {
    const { data, error: dbError } = await supabase
        .from("cells")
        .select(`
      id,
      manufacturer,
      model,
      cell_format,
      mass_g,
      capacity_ah,
      energy_wh,
      voltage_nominal_v,
      voltage_min_v,
      voltage_max_v,
      current_max_charge_a,
      current_max_discharge_a,
      internal_resistance__initial_mohm,
      charge_discharge_cycles,
      capacity_retention,
      temperature_oparating_min_celcius,
      temperature_oparating_max_celcius,
      chemistry
    `)
        .order("manufacturer", { ascending: true })
        .order("model", { ascending: true });

    if (dbError) {
        console.error("Fehler beim Laden der Zellen:", dbError);
        throw error(500, "Fehler beim Laden der Zellen aus der Datenbank");
    }

    return {
        cells: data ?? []
    };
};
