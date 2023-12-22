<!-- src/routes/+Layout.svelte -->

<script>

  import { pageObjectsStore } from '$lib/stores/routes.js';

  const pages = import.meta.glob('/src/routes/*/**/+page.svelte');
  const pageObjects = [];

  Object.keys(pages).forEach((path) => {
    // Skip the paths which contain square brackets
    if (path.includes('[') || path.includes(']')) return;

    const levels = path.replace('/src/routes/', '').split('/');
    const cleanLevels = levels.filter(level => level !== '+page.svelte'); 

    let routeName = cleanLevels[cleanLevels.length - 1].charAt(0).toUpperCase() + cleanLevels[cleanLevels.length - 1].slice(1);
    
    pageObjects.push({
        route_name: cleanLevels.join('/'),
        formattedRouteName: routeName,
        url_path: `/${cleanLevels.join('/')}`,
        path: path.replace('/src/routes/', '')
    });
  });

  // Add this line to add the hardcoded values
  pageObjects.unshift({
      "route_name": "home",
      "formattedRouteName": "Home",
      "url_path": "/",
      "path": "+page.svelte"
  });

  // group pages by parent
  const grouped = {};
  for (let page of pageObjects) {
    let parent = page.route_name.split('/')[0];
    if (!grouped[parent]) {
      grouped[parent] = [];
    }
    grouped[parent].push(page);
  }

  pageObjectsStore.set(grouped);

  console.log('pageObjects: ', pageObjects);

  import { browser } from '$app/environment';
  import { page as pageStore } from '$app/stores'; // import page store

  let page;
  let breadcrumbs = [];

  pageStore.subscribe((value) => { // subscribe to page store
      page = value;
      updateBreadcrumbs(); // call updateBreadcrumbs when the page changes
  });

  function updateBreadcrumbs() {
      if (browser) {
          let route = window.location.pathname.split('/').filter(el => el !== '');
          breadcrumbs = route.map((r, idx, array) => {
              return {
                  text: r.charAt(0).toUpperCase() + r.slice(1),
                  href: "/" + array.slice(0, idx + 1).join('/')
              };
          });
          //console.log('breadcrumbs: ', breadcrumbs);
      }
  }

  //console.log('group: ', grouped);

  import "../app.pcss";
  import "$lib/uikit-3.17.11/css/uikit.min.css";
  import "$lib/uikit-3.17.11/js/uikit.min.js";
  import "$lib/uikit-3.17.11/js/uikit-icons.min.js";
  import "$lib/css/style.css";
  import "$lib/css/roles.css"; // hide and show content based on css rules and classes corresponding to task and role

  import Sidebar from "$lib/components/sidebar/Sidebar.svelte";
  import Auth from "$lib/components/auth/Auth.svelte";
  import { onMount } from 'svelte';
  import PocketBase from 'pocketbase';
  
  let pb;

  onMount(async () => {
      pb = new PocketBase('https://vdm.pockethost.io/');
  });

  function logout(){
      localStorage.removeItem('auth');
      localStorage.removeItem('authorized');
    }

</script>

<Auth>

  <div class="uk-container uk-container-large">
    <div class="uk-grid-small" uk-grid>
      <div class="uk-width-1-5@s uk-visible@s sidebar" style="min-height: 100vh;">
         <div class="uk-card uk-card-default uk-card-body" style="min-height: 100vh;">
           <Sidebar />
         </div>
      </div>
      <div class="uk-width-1-1 uk-width-4-5@s main" style="min-height: 100vh;">
         <div class="uk-card uk-card-default uk-card-body" style="min-height: 100vh;">

          <ul class="uk-breadcrumb" style="padding-left:5px;margin:0;margin-bottom:10px;">
            {#if breadcrumbs.length > 0}
              {#each breadcrumbs as bc}
                <li><a href={bc.href}>{bc.text}</a></li>
              {/each}
            {:else}
              <li><a href="/">Home</a></li>
            {/if}
          </ul>
          <hr style="margin:0;margin-bottom:30px;"/>

          <div class="uk-container" style="padding:0 10px;">
            <slot />
          </div>

         </div>
      </div>
    </div>
  </div>

  <a href="#off-canvas-menu" uk-toggle class="uk-hidden@s uk-button uk-button-small" style="position:fixed;top:10px;right:10px;">
    <span uk-icon="icon: menu"></span>
  </a>
  <div id="off-canvas-menu" uk-offcanvas="overlay: true">
      <div class="uk-offcanvas-bar">
         <button class="uk-offcanvas-close" type="button" uk-close></button>
         <Sidebar />
      </div>
  </div>

</Auth>

<style>
  ul.uk-breadcrumb li::before {
    margin:0 7px;
  }
  ul.uk-breadcrumb li a {
    margin:0 !important;
    padding:0 !important;
    font-size: 0.9em;
  }
</style>


