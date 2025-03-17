
    import type { PageLoad } from './$types';
    import boaviztaClient from "$lib/api";
    import type { VerboseServerImpacts } from "$lib/types/impact";
    import type {
      Server,
      Usage,
    } from "$lib/types/hardware";
    let architems, rammanufitems, ssdmanufitems

        let verboseImpacts: VerboseServerImpacts = {
          adp: {
            embedded: {
              hdd: 0,
              motherboard: 0,
              power_supply: 0,
              cpu: 0,
              ram: 0,
              ssd: 0,
              case: 0,
            },
            use: {
              total: 0,
            },
            unit: "kgSbeq",
          },
          pe: {
            embedded: {
              hdd: 0,
              motherboard: 0,
              power_supply: 0,
              cpu: 0,
              ram: 0,
              ssd: 0,
              case: 0,
            },
            use: {
              total: 0,
            },
            unit: "MJ",
          },
          gwp: {
            embedded: {
              hdd: 0,
              motherboard: 0,
              power_supply: 0,
              cpu: 0,
              ram: 0,
              ssd: 0,
              case: 0,
            },
            use: {
              total: 0,
            },
            unit: "kgCO2e",
          },
        };

let usageConfig: Usage = {
  avg_power: {
    default: 150,
    value: 150,
    min: 50,
    max: 250,
  },
  use_time_ratio: {
    value: 1,
    hours_per_day: 24,
  },
  years_life_time: {
    value: 5,
  },
  usage_location: {
    value: "WOR",
    label: "World",
  },
  extendLifetime: {
    value: 0,
  },
  time_workload: [
    {
      time_percentage: 30,
      load_percentage: 50,
    },
    {
      time_percentage: 30,
      load_percentage: 30,
    },
    {
      time_percentage: 40,
      load_percentage: 10,
    },
  ],
};

let server: Server = {
  model: {
    type: "rack",
  },
  config: {
    cpu: {
      units: 2,
      core_units: 16,
      tdp: 150,
    },
    ram: [
      {
        units: 4,
        capacity: 32,
      },
    ],
    disk: [
      {
        units: 4,
        capacity: 1000,
        type: "ssd",
      },
      {
        units: 2,
        capacity: 1000,
        type: "hdd",
      },
    ],
    power_supply: {
      units: 2,
    },
  },
  usage: {
    avg_power: 150,
    use_time_ratio: 1,
    hours_life_time: 5 * 365 * 24,
    usage_location: "WOR",
  },
};


    export const load: PageLoad = async ({ fetch, params }) => {
    boaviztaClient.setFetchMethod(fetch)
    let families_route = "utils/cpu_family";
    let ssd_manuf_route = "utils/ssd_manufacturer";
    let ram_manuf_route = "utils/ram_manufacturer";
    architems = await boaviztaClient.getitems(families_route);
    rammanufitems = await boaviztaClient.getitems(ram_manuf_route);
    ssdmanufitems = await boaviztaClient.getitems(ssd_manuf_route);
      return {
        usageConfig,
        server,
        verboseImpacts,
        architems,
        rammanufitems,
        ssdmanufitems,
      };
    };
   