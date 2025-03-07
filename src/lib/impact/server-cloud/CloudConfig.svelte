<script lang="ts">
    import type { Cloud } from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get, getitems, getAllInstances} from "$lib/api";

    /*Bound var*/
    export let cloudConfig: Cloud

    let cloud_providers_route = "cloud/instance/all_providers";


    let cloud_providers = []
    let cloud_instances = []



    function getfirstitem(route) {
        return get(route).then((response) => response.json())
            .then((data) => {
                return data[0]
            });
    }

    onMount(async () => { 

        cloud_providers = await getitems(cloud_providers_route);
        cloud_instances = await getAllInstances(cloudConfig.provider)

    })

    async function provider_select(event){
        cloud_instances = await getAllInstances(event.detail.value)
        cloudConfig = {
            "instance_type": cloud_instances[0].value,
            "provider":event.detail.value,
            "usage":cloudConfig.usage
        }

        
    }

    function instance_select(event){
        cloudConfig.instance_type = event.detail.value
    }


   
</script>

  <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('cloud-config.provider')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={cloud_providers} on:select={provider_select} value="{cloudConfig.provider}"/>
        </div>
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('cloud-config.instance_type')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={cloud_instances} on:select={instance_select} value="{cloudConfig.instance_type}"/>
        </div>
    </div>
