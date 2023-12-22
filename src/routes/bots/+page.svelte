<!--src/routes/bots/+page.svelte-->
<script>
    import { onMount } from 'svelte';
    import Loading from '$lib/components/ui/Load1.svelte';
    import "$lib/css/roles.css";

    let authData = JSON.parse(localStorage.getItem('auth_data'));
    let userRole = authData.record.role;
    let authenticatedUserId = authData.record.id;

    import botsStore from '$lib/stores/botsStore';

    let allBots = [];

    const loadData = async () => {
        botsStore.subscribe(bots => {  // Subscribe to botsStore
            allBots = bots;  // Store the bots in the 'allBots' variable
        });

        await Promise.all([botsStore.fetchBots()]).then(() => {
            console.log('allBots:', allBots);
        })
    }

    onMount(() => {
        loadData()
    });
    
</script>

<h1>Bots</h1>
<p>Hieronder een overzicht van de bots (digitale assistenten) die we hebben om leerlingen toegang te geven tot AI en eerste lijns vraagbaak.</p>
<hr />

{#if allBots && allBots.length > 0}

{#each allBots as bot (bot.id)}
    <div class="uk-child-width-1-2@s uk-child-width-1-4@m uk-grid-small uk-grid-match" uk-grid>
        <div>
            <div class="uk-card uk-card-small uk-card-body" style="">
                <h4 class="uk-card-title">{bot.titel}</h4>
                <div>
                    <p>
                        Link: <a href="{bot.url}" target="_blank">Klik hier &rarr;</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
{/each}

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
