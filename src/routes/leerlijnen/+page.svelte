<!--src/routes/leerlijnen/+page.svelte-->
<script>
    import { onMount } from 'svelte';
    import Loading from '$lib/components/ui/Load1.svelte';
    import "$lib/css/roles.css";

    let authData = JSON.parse(localStorage.getItem('auth_data'));
    let userRole = authData.record.role;
    let authenticatedUserId = authData.record.id;

    import leerlijnenStore from '$lib/stores/leerlijnenStore';
    import materialenStore from '$lib/stores/materialenStore';

    let allLeerlijnen = [];
    let allMaterialen = [];

    const loadData = async () => {
        leerlijnenStore.subscribe(leerlijnen => {
            allLeerlijnen = leerlijnen;
        });
        materialenStore.subscribe(materialen => {
            allMaterialen = materialen;
        });

        await Promise.all([leerlijnenStore.fetchLeerlijnen(), materialenStore.fetchMaterialen()]).then(() => {
            console.log('allLeerlijnen:', allLeerlijnen);
            console.log('allMaterialen:', allMaterialen);
        })
    }

    onMount(() => {
        loadData()
    });

    const hasMateriaal = (leerlijnId) => {
        return allMaterialen.some(materiaal => materiaal.leerlijn === leerlijnId);
    }
    
</script>

<h1>Content per leerlijn</h1>
<p>Klik op een leerlijn om de inhoud, materialen, tools en ai bots te bekijken.</p>
<hr />

{#if allLeerlijnen && allLeerlijnen.length > 0 && allMaterialen && allMaterialen.length > 0 && 1===1}

<ul uk-accordion="multiple: true">
    {#each allLeerlijnen as leerlijn (leerlijn.id)}
    {#if hasMateriaal(leerlijn.id)}
    <li class="item">
        <a class="uk-accordion-title" href>{leerlijn.leerlijn}</a>
        <div class="uk-accordion-content">

            <div class="uk-child-width-1-2@s uk-child-width-1-4@m uk-grid-small uk-grid-match" uk-grid>
                {#each allMaterialen as materiaal (materiaal.id)}
                {#if leerlijn.id === materiaal.leerlijn}
                <div>
                    <div class="uk-card uk-card-small uk-card-body" style="">
                        <h4 class="uk-card-title">{materiaal.titel}</h4>
                        <div>
                            <p>
                                Les: {materiaal.expand.les.les} <br />
                                Onderdeel: {materiaal.onderdeel} <br />
                                Type: {materiaal.type_document} <br />
                                {#if    materiaal.type_document === 'url' || materiaal.type_document === 'video' || materiaal.type_document === 'audio'
                                        || (materiaal.type_document === 'document' && materiaal.url)}
                                Link: <a href="{materiaal.url}" target="_blank">Klik hier &rarr;</a> <br />
                                {/if}
                            </p>
                        </div>
                        {#if materiaal.document}
                            <a href="{import.meta.env.VITE_POCKETBASE_URL}api/files/{materiaal.collectionId}/{materiaal.id}/{materiaal.document}" target="_blank">
                                <img style="width:30px;position:absolute;right:10px;bottom:10px;border:0px solid #eee;padding:1px;" 
                                    src="../img/pdf-40.png"
                                    alt="document"
                                    uk-tooltip="Klik hier voor het document"
                                />
                            </a>
                        {/if}
                    </div>
                </div>
                {/if}
                {/each}
            </div>

        </div>
    </li>
    {/if}
    {/each}
</ul>

{:else}
    <Loading />
{/if}

<style>
li.item {
    border-bottom:0px solid #eee;
}
li.item a.uk-accordion-title {
    padding:10px;
    border-bottom: 1px solid #c5c5c5;
}
li.item a.uk-accordion-title:hover {
    background:#eee;
}
.uk-accordion-content {
    padding-bottom:20px;
    border-bottom: 1px solid #c5c5c5;
}
h4 {
    font-size: 1.1em;
    margin:4px 0;
}

.uk-card {
    color:#000;
    text-decoration: none !important;
    background:#fff;
    border:1px dotted #ccc;
    padding:15px 20px !important;
}
.uk-card:hover {
    color:#000;
    text-decoration: none !important;
    background:#f9f9f9;
    border:1px solid #bbb;
}
</style>
