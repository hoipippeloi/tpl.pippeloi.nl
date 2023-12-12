<script>
    import { pageObjectsStore } from '$lib/stores/routes.js';
    let nav;
    pageObjectsStore.subscribe(value => {nav = value});
    let activeItem = '';
    const setActive = (item) => {
        activeItem = item;
    };

    function logout() {
      localStorage.removeItem('auth');
      localStorage.removeItem('authorized');
      window.location = '/';
    }
</script>

<div class="uk-width-1-1@s nav">
    <ul class="uk-nav-primary uk-nav-parent-icon" uk-nav>
        {#each Object.values(nav) as group (group[0].route_name)}
            {#if group.length > 1}
                <li class="uk-parent">
                    <a href="#">{group[0].formattedRouteName} <span uk-nav-parent-icon></span></a>
                    <ul class="uk-nav-sub">
                        {#each group as page (page.route_name)}
                        {#if group[0].formattedRouteName != page.formattedRouteName}
                            <li>
                                <a 
                                    href={page.url_path} 
                                    class="{page.route_name === activeItem ? 'active' : ''}"
                                    on:click="{() => setActive(page.route_name)}">
                                    {page.formattedRouteName}
                                </a>
                            </li>
                        {/if}
                        {/each}
                    </ul>
                </li>
            {:else}
                <li>
                    <a 
                        href={group[0].url_path} 
                        class="{group[0].route_name === activeItem ? 'active' : ''}"
                        on:click="{() => setActive(group[0].route_name)}">
                        {group[0].formattedRouteName}
                    </a>
                </li>
            {/if}
        {/each}
        <li><a href="#logout" on:click|preventDefault="{logout}">Logout <span style="margin-top:2px;margin-left:3px;" uk-icon="icon: sign-out; ratio: 0.6"></span></a></li>
    </ul>
</div>

<style>
    ul, li a {
        font-size: 1em;
    }

    .active {
        color: #000;
        font-weight:600;
    }
</style>
