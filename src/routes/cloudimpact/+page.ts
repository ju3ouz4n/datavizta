
    import type { PageLoad } from './$types';
    import type { Cloud, Usage } from "$lib/types/hardware";
    import { getCloudImpact, getitems, getAllInstances } from "$lib/api";
    
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


    export const load: PageLoad = async ({ params }) => {
        let cloud_instances = await getAllInstances(cloud_instance.provider);
        cloud_instance.instance_type = cloud_instances[0].value;
        return {
          config: {
            cloud_instance,
            usageConfig,
          },
        };
    };
   