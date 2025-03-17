
    import type { PageLoad } from './$types';
    import type { Cloud, Usage } from "$lib/types/hardware";
    import type { VerboseServerImpacts } from "$lib/types/impact";

    import boaviztaClient from "$lib/api";
    
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
            max: 250
        },
        use_time_ratio: {
            value: 1,
            hours_per_day: 24
        },
        years_life_time: {
            value: 5
        },
        usage_location: {
            value: "WOR",
            label: "World"
        },
        extendLifetime: {
            value: 0
        },
        time_workload : [ {
            time_percentage : 30,
            load_percentage : 50
        },
        {
            time_percentage : 30,
            load_percentage : 30
        },
        {
            time_percentage : 40,
            load_percentage : 10
        }]
    }

    let cloud_instance: Cloud = {
        provider: "aws",
        instance_type: "a1.2xlarge",
        usage : {
            avg_power : null,
            use_time_ratio: 1,
            hours_life_time: 5 * 365 * 24,
            usage_location: "WOR",
            time_workload: [{
                time_percentage: 100,
                load_percentage: 50
            }]
        }
    };



    export const load: PageLoad = async ({ fetch, params }) => {
  
        boaviztaClient.setFetchMethod(fetch)
        let cloud_instances = await boaviztaClient.getAllInstances(
          cloud_instance.provider
        );
        cloud_instance.instance_type = cloud_instances[0].value;
        cloud_instance.provider = cloud_instance.provider;
        verboseImpacts = await boaviztaClient.loadAndFormatCloudImpacts(
          cloud_instance,
          verboseImpacts
        );
        return {
          config: {
            cloud_instance,
            usageConfig,
            verboseImpacts
          },
        };
    };
   