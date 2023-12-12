<script>

    let access = ['admin', 'user'];

    let authData = JSON.parse(localStorage.getItem('auth_data'));
    let userRole = authData.record.role;

    import Lijst from "$lib/components/medewerkers/Lijst.svelte";
    import Aanmaken from "$lib/components/medewerkers/Aanmaken.svelte";
    //import Wijzigen from "$lib/components/medewerkers/Wijzigen.svelte";
    import "$lib/css/roles.css"; // hide and show content based on css rules and classes corresponding to task and role
    
</script>

<div id="medewerkers">

    <ul uk-tab>
        <li class="lijst {userRole}"><a href="#">Lijst</a></li>
        <li class="aanmaken {userRole}"><a href="#">Aanmaken</a></li>
        <li class="help {userRole}"><a href="#">Help</a></li>
    </ul>

    <ul class="uk-switcher uk-margin">
        <li>
            <Lijst />
        </li>
        <li>
            <Aanmaken />
        </li>
        <li>
            <p>Content Test Help</p>
        </li>
    </ul>

</div>