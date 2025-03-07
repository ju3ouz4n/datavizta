
    import type { PageLoad } from './$types';
    import { getUserDeviceImpact, getExtendLifetimeAvoid } from "$lib/api";
    import type { Usage, UserDevice } from "$lib/types/hardware";
    import type { Impacts } from "$lib/types/impact";
    
    let impacts: Impacts;

    let usageConfig: Usage = {
      avg_power: {
        default: 150,
        value: 150,
        min: 50,
        max: 250,
      },
      use_time_ratio: {
        value: 0.2,
      },
      usage_location: {
        value: "WOR",
        label: "World",
      },
      extendLifetime: {
        value: 0,
      },
      years_life_time: {
        value: 5,
      },
      time_workload: [
        {
          time_percentage: 100,
          load_percentage: 50,
        },
      ],
    };
    let userDevice: UserDevice = {
      category: "terminal",
      subcategory: "laptop",
      archetype: "laptop-pro",
      usage: {
        usage_location: "WOR",
      },
    };

        
    let yearly: boolean = false;


    export const load: PageLoad = async ({ params }) => {
      return {
        usageConfig,
        userDevice,
        yearly
      };
    };
   