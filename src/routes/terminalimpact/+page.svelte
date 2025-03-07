<script lang="ts">
    import ResultGrid from "$lib/impact/terminal/ResultGrid.svelte";
    import UserDeviceConfig from "$lib/impact/terminal/TerminalConfig.svelte";
    import type { Usage, UserDevice } from "$lib/types/hardware";
    import UsageConfig from "$lib/impact/usageconfig/UsageConfig.svelte";
    import { _ } from "svelte-i18n";
    import DetailedUsageConfig from "$lib/impact/usageconfig/DetailedUsageConfig.svelte"
    import * as Utils from "$lib/utils"
    import type { Impacts } from "$lib/types/impact";
    import { getUserDeviceImpact,getExtendLifetimeAvoid} from "$lib/api";
    
    /** @type {{ data: import('./$types').PageData }} */
    export let data;
    export let impacts:Impacts;
	export let { userDevice,usageConfig,yearly } = data;
    
function updateFromChildComponents(params){
     userDevice = params.detail.userDeviceConfig;
     usageConfig= params.detail.usageConfig;
}

async function updateImpact(dev,config,y) {
    let updatedImpacts =  await getUserDeviceImpact(dev, y);
    updatedImpacts.avoided = getExtendLifetimeAvoid(config.years_life_time.value,config.extendLifetime.value,updatedImpacts,y)
    return updatedImpacts;
    }

    $: impacts = updateImpact(userDevice,usageConfig,yearly);
</script>

<div id="content" class="px-1">
    <h2 class="title-second mt-2 mb-4 w-full px-4">{$_('terminal-impact.title')}</h2>
    <div class="grid md:grid-cols-12 gap-1">
        <div class="min-h-[200px] md:col-span-5 px-1 w-full ">
            <form> 
                <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('terminal-config.configuration')}</h2>
                <div id="terminalconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid gap-1">
                    <UserDeviceConfig userDeviceConfig={userDevice} usageConfig={usageConfig} on:terminalConfigComponentInit={updateFromChildComponents} on:terminalConfigComponentUpdated={updateFromChildComponents}/>
                </div>
                <h2 class="m-2 text-2xl font-bold">{$_('terminal-config.usage')}</h2>
                <div id="terminalconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid gap-1">
                    <UsageConfig bind:usage={userDevice.usage} bind:usageConfig={usageConfig} usageType="Terminal" />
                    <p on:click={() => Utils.toggleElement("usageconfig-detailed")} class="ml-2 block w-full col-span-6"><a class="text-xs" href="javascript:void(0);" >> {$_('detailed-config.show-usage')}</a></p>
                    <div id="usageconfig-detailed" class="hidden col-span-6">
                        <DetailedUsageConfig bind:serverImpact={impacts}/>
                    </div>
                </div>
            </form>
            
        </div>
        
        <div class="px-1 md:col-span-7">
            <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('impacts.Results')}</h2>
            {$_('pie.total')}
                <label class="mw-1/3 switch">
                    <input type="checkbox" id="yearlycheck" bind:checked={yearly}>
                    <span class="slider round"></span>
                </label>
            {$_('pie.yearly')}
            <ResultGrid {impacts}/>
        </div>
    </div>
    <div class="m-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        <h3 class="text-xl font-bold">{$_('terminal-impact-desc.how')}</h3>
        <p class="mb-2">
            {$_('terminal-impact-desc.how_content1')} <a href={$_('terminal-impact-desc.articlelink')} class='no-underline hover:underline blue text-sky-800' target='_blank'>{$_('terminal-impact-desc.how_content2')}</a>.
            {$_('terminal-impact-desc.how_content3')} <a href='https://doc.api.boavizta.org/' class='no-underline hover:underline blue text-sky-800' target='_blank'>doc.api.boavizta.org</a>.

        </p>
        <h3 class="text-xl font-bold">{$_('terminal-impact-desc.further')}</h3>
        <p class="">
            {$_('terminal-impact-desc.further_content1')}  <a href='https://github.com/boavizta/boaviztapi/'class='no-underline hover:underline blue text-sky-800' target='_blank'>BoaviztAPI</a>{$_('terminal-impact-desc.further_content2')}
        </p>
    </div>

</div>
