<script lang="ts">
   
    import ServerConfig from "$lib/impact/server-cloud/ServerConfig.svelte";

    import ResultGrid from "$lib/impact/server-cloud/ResultGrid.svelte";
    import UsageConfig from "$lib/impact/usageconfig/UsageConfig.svelte";
    import type { Impacts } from "$lib/types/impact";
    import { _ } from "svelte-i18n";
    import boaviztaClient from "$lib/api";
    import DetailedUsageConfig from "$lib/impact/usageconfig/DetailedUsageConfig.svelte"
    import * as Utils from "$lib/utils"

    
    

        /** @type {{ data: import('./$types').PageData }} */
    export let data;
	export let { server,usageConfig, architems, rammanufitems, ssdmanufitems, verboseImpacts: formattedImpacts} = data;

    //Default values
    server.config.cpu.family = "skylake";
    server.config.ram[0].manufacturer = "Samsung";
    server.config.disk[0].manufacturer= "Micron";

    let serverImpact: Impacts;



    $: updateImpact(server);
    async function updateImpact(srv) {
        serverImpact = await boaviztaClient.getServerImpact(srv);
        formattedImpacts = boaviztaClient.mapImpactsFromApi(formattedImpacts, serverImpact)
        return formattedImpacts;
    }
</script>

<div id="content" class="px-1">
    <h2 class="title-second mt-2 mb-4 w-full px-4">{$_('server-impact.title')}</h2>
    <div class="grid md:grid-cols-12 gap-1">
        <div class="min-h-[200px] md:col-span-5 px-1 w-full ">
            <form> 
                <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('server-config.configuration')}</h2>
                <div id="serverconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid gap-1">
                    <ServerConfig bind:serverConfig={server} bind:usageConfig={usageConfig} {architems} {rammanufitems} {ssdmanufitems} />
                </div>
                <h2 class="m-2 text-2xl font-bold">{$_('server-config.usage')}</h2>
                <div id="serverconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid gap-1">
                    <UsageConfig bind:usage={server.usage} bind:usageConfig={usageConfig} usageType="server"/>
                    <p on:click={() => Utils.toggleElement("usageconfig-detailed")} class="ml-2 block w-full col-span-6"><a class="text-xs" href="javascript:void(0);" >> {$_('detailed-config.show-usage')}</a></p>
                    <div id="usageconfig-detailed" class="hidden col-span-6">
                    <DetailedUsageConfig {serverImpact}/>
                    </div>
                </div>
            </form>
            
        </div>
        
        <div class="px-1 md:col-span-7">
            <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('impacts.Results')}</h2>
                <ResultGrid verboseImpacts={formattedImpacts}/>
        </div>
    </div>
    <div class="m-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        <h3 class="text-xl font-bold">{$_('server-impact-desc.how')}</h3>
        <p class="mb-2">
            {$_('server-impact-desc.how_content1')} <a href={$_('server-impact-desc.articlelink')} class='no-underline hover:underline blue text-sky-800' target='_blank'>{$_('server-impact-desc.how_content2')}</a>.
            {$_('server-impact-desc.how_content3')} <a href='https://doc.api.boavizta.org/' class='no-underline hover:underline blue text-sky-800' target='_blank'>doc.api.boavizta.org</a>.

        </p>
        <h3 class="text-xl font-bold">{$_('server-impact-desc.further')}</h3>
        <p class="">
            {$_('server-impact-desc.further_content1')}  <a href='https://github.com/boavizta/boaviztapi/'class='no-underline hover:underline blue text-sky-800' target='_blank'>BoaviztAPI</a>{$_('server-impact-desc.further_content2')}
        </p>
    </div>

</div>
