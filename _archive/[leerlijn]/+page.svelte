<!--src/routes/leerlijnen/[leerlijn]/+page.svelte-->
<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import materialenStore from '$lib/stores/materialenStore';

    let id;
    let allMaterialen = [];
    let selectedMaterials;

    page.subscribe(({ params }) => {
        id = params.leerlijn;
    });

    const loadData = async () => {
        materialenStore.subscribe(materialen => {
            allMaterialen = materialen;
        });
        await Promise.all([materialenStore.fetchMaterialen()]).then(() => {
            selectedMaterials = allMaterialen.filter(materiaal => materiaal.leerlijn == id);
            console.log('selectedMaterials:', selectedMaterials);
        })
    }

    onMount(() => {
        loadData()
    });
</script>

{#if selectedMaterials}
<h1>Materials for leerlijn</h1>
<div>
    {#each selectedMaterials as materiaal (materiaal.id)}
    <div>
        
    </div>
    {/each}
</div>
{/if}
