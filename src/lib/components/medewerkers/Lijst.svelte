<script>
    import { onMount } from 'svelte';
    import userStore from '$lib/stores/userStore';
    import "$lib/css/roles.css";
    import PocketBase from 'pocketbase';

    let authData = JSON.parse(localStorage.getItem('auth_data'));
    let userRole = authData.record.role;
    let authenticatedUserId = authData.record.id;
    let allUsers = [];
    let userId = "";
    let isSuccessMessageVisible = false;
    let emailError = "";
    let isConfirmDeleteVisible = false;
    let formVisible = true;
    let sentMessage = "";

    let user = {
        email: "",
        username: "",
        name: "",
        telefoon: "",
        role: "",
        emailVisibility: "",
        active: "",
        avatar:"",
    };

    onMount(() => {
        userStore.subscribe(users => {
            allUsers = users;
        });

        userStore.fetchUsers();
    });

    async function editUser(id) {
        userId = id;
        user = await pb.collection('users').getOne(userId);
        console.log(user);
        UIkit.modal('#user-modal').show();
    };

    const updateUser = async () => {
        const data = {
            username: user.username,
            email: user.email,
            name: user.name,
            telefoon: user.telefoon,
            role: user.role,
            avatar: user.avatar,
            emailVisibility: user.emailVisibility,
            active: user.active,
        };

        try {
            await userStore.updateUser(userId, data);        // <-- Use updateUser here
            isSuccessMessageVisible = true;

            setTimeout(() => {
                isSuccessMessageVisible = false;
                UIkit.modal('#user-modal').hide();  // Close the modal
            }, 500);

        } catch (error) {
            console.error(error);
            if (error.message.includes("email")) emailError = error.message;
        }
    };

    var avatarPreview;

    const handleImageUpload = event => {
        const imageFile = event.target.files[0];
        if(imageFile && imageFile.size <= 4 * 1024 * 1024) {
            var reader = new FileReader();

            reader.onloadend = function() {
                avatarPreview.src = reader.result; //Use the bound variable here
            }
            reader.readAsDataURL(imageFile);

            user.avatar = imageFile;
        } else {
            alert('Image size must be less than 4MB');
        }
    };

    async function confirmDeleteUser() {
        await userStore.deleteUser(userId);
        UIkit.modal('#user-modal').hide();  // Close the modal
        isConfirmDeleteVisible = false;
    }

    function askForDeleteConfirmation() {
        isConfirmDeleteVisible = true;
        formVisible = false;
    }

    function cancelDelete() {
        isConfirmDeleteVisible = false;
        formVisible = true;
    }

    async function sendPasswordReset() {
        try {
            await pb.collection('users').requestPasswordReset(user.email);
            console.log("Password reset email sent successfully.");
            sentMessage = "Password reset email sent successfully.";
        } catch (error) {
            console.error("An error occurred while sending the password reset email: ", error);
            sentMessage = "An error occurred while sending the password reset email.";
        }
    }

</script>


{#if allUsers}

<div class="uk-child-width-1-2@s uk-child-width-1-4@m uk-grid-small uk-grid-match" uk-grid>
    {#each allUsers as user (user.id)}
    <div>
        <div class="uk-card uk-card-small uk-card-body {user.active ? 'active' : 'inactive'}"
        style="">
            <h4 class="uk-card-title">{user.name}</h4>
            <p>
                E-mail: {user.email} <br />
                Actief: {user.active ? 'Ja' : 'Nee'} <br />
            </p>

            <span class="uk-badge status" 
                style="position:absolute;right:13px;top:13px;cursor:help;min-width:10px;width:10px !important;height:10px;z-index:100;" 
                uk-tooltip="{user.active ? 'Actief' : 'Inactief'}">
            </span>

            <a href="#" on:click|preventDefault={() => editUser(user.id)}> 
                <span class="uk-badge edit {userRole}"
                    style="position:absolute;right:10px;bottom:10px;cursor:pointer;height:30px;width:30px;" 
                    uk-tooltip="Gebruiker aanpassen"
                    uk-icon="icon: cog; ratio: 0.8">
                </span>
            </a>

            <img class="uk-border-circle" 
                style="width:48px;height:48px;position:absolute;right:10px;top:10px;border:1px solid #eee;padding:1px;" 
                src={user.id && user.avatar ? `https://vdm.pockethost.io/api/files/_pb_users_auth_/${user.id}/${user.avatar}` : '../img/avtr7.png'} 
                alt="Avatar"
            />

        </div>
    </div>
    {/each}
</div>

<!-- Modal for edit user form -->
<div id="user-modal" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        {#if isConfirmDeleteVisible}
            <div class="uk-alert-danger" uk-alert>
                <p>Weet u zeker dat u deze gebruiker wilt verwijderen?</p>
                <p>
                    <button class="uk-button uk-button-primary uk-margin-top uk-margin-right" on:click|preventDefault={confirmDeleteUser}>Ja</button>
                    <button class="uk-button uk-button-default uk-margin-top" on:click|preventDefault={cancelDelete}>Nee</button>
                </p>
            </div>
        {:else}
        <form class="uk-grid-small" uk-grid on:submit|preventDefault={updateUser}>
            <div class="uk-width-1-1">
                <label class="uk-form-label" for="email">E-mail</label>
                <input bind:value={user.email} id="email" type="email" placeholder="Typ je email adres" class="uk-input" />
            </div>

            <div class="uk-width-1-1">
                <label class="uk-form-label" for="username">Gebruikersnaam</label>
                <input bind:value={user.username} id="username" type="text" placeholder="Kies een gebruikersnaam" class="uk-input" required disabled />
            </div>

            {#if sentMessage}
                <div class="uk-width-1-1">
                    <div class="uk-alert-success" uk-alert>
                        <a class="uk-alert-close" uk-close></a>
                        <p>{sentMessage}</p>
                    </div>
                </div>
            {:else}
                <div class="uk-width-1-1">
                    <button class="uk-button uk-button-default" type="button" 
                        on:click|preventDefault={sendPasswordReset}
                        uk-tooltip="title: Send password reset; pos: left">
                        Wachtwoord resetten
                    </button>
                </div>
            {/if}

            <div class="uk-width-1-1">
                <label class="uk-form-label" for="name">Volledige naam</label>
                <input bind:value={user.name} id="name" type="text" placeholder="Typ je voor- en achternaam" class="uk-input" required />
            </div>

            <div class="uk-width-1-1">
                <label class="uk-form-label" for="telefoon">Telefoon</label>
                <input bind:value={user.telefoon} id="telefoon" type="text" placeholder="Typ je telefoonnummer" class="uk-input" required />
            </div>

            <div uk-form-custom="target: true" style="width:100%;cursor:pointer !important;">
                <label style="cursor:pointer !important;" class="uk-form-label" for="telefoon">Je profiel foto</label>
                <img bind:this={avatarPreview} class="uk-border-circle" 
                    style="width:48px;height:48px;margin:5px;border:1px solid #eee;padding:1px;cursor:pointer !important;" 
                    src={user.id && user.avatar ? `https://vdm.pockethost.io/api/files/_pb_users_auth_/${user.id}/${user.avatar}` : '../img/avtr7.png'} 
                    alt="Avatar"
                />
                <input style="cursor:pointer !important;" class="uk-input uk-form-width-medium uk-width-1-1" 
                type="file" aria-label="Custom controls" accept="image/*" on:change={handleImageUpload}>
                <input style="cursor:pointer !important;" class="uk-input uk-form-width-medium uk-width-1-1" 
                type="text" placeholder="Of selecteer een andere foto vanaf je apparaat" aria-label="Custom controls" disabled>
            </div>

            <div class="uk-width-1-1">
                <label class="uk-form-label" for="role">Role</label><br />
                <select bind:value={user.role} class="uk-select" id="role">
                    <option value="">Selecteer...</option>
                    <option value="admin">Admin</option>
                    <option value="planner">Planner</option>
                    <option value="user">Gebruiker</option>
                    <option value="guest">Gast</option>
                </select>
            </div>
            
            <div class="uk-width-1-1" uk-grid>
            <!--
                <div class="uk-width-1-2">
                    <div class="uk-width-1-1">
                        <label class="uk-form-label" for="emailVisibility">E-mail openbaar?</label>
                    </div>
                    <label class="switch">
                        <input type="checkbox" bind:checked={user.emailVisibility}>
                        <span class="slider round"></span>
                    </label>
                </div>
            -->
                <div class="uk-width-1-2">
                    <div class="uk-width-1-1">
                        <label class="uk-form-label" for="verified">Actief?</label>
                    </div>
                    <label class="switch">
                        <input type="checkbox" bind:checked={user.active}>
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <hr class="uk-width-1-1" />

            <div class="uk-width-1-1">
                <button class="uk-button uk-button-primary" type="submit">Opslaan</button>
                <button class="uk-button uk-button-secondary uk-modal-close" type="button">Sluiten</button>
                <button class="uk-button uk-button-danger" type="button" 
                    style="float:right;"
                    on:click|preventDefault={user.id === authenticatedUserId ? null : askForDeleteConfirmation}
                    uk-tooltip="title: {user.id === authenticatedUserId ? 'Je kunt jezelf niet verwijderen' : 'Verwijder deze gebruiker'}; pos: left"
                    disabled={user.id === authenticatedUserId}
                    >
                        <span style="margin-top:6px;margin-bottom:-6px;" uk-icon="icon: trash; ratio: 1"></span>
                </button>
            </div>

        </form>
        {/if}

        {#if isSuccessMessageVisible}
            <div class="uk-alert-success" uk-alert>
                <a class="uk-alert-close" uk-close></a>
                <p>Medewerker succesvol bijgewerkt.</p>
            </div>
        {/if}
    </div>
</div>

{/if}


<style>
h4 {
    font-size: 1em;
}
.uk-card.inactive {
    background:#eee;
    border:1px dotted #c5c5c5;
}
.uk-card.active {
    border:1px solid #eee;
    border:1px solid #c5c5c5;
}
.uk-card.inactive span.uk-badge.status {
    background:#c40e0e;
}
.uk-card.active span.uk-badge.status {
    background:#34b90c;
}

span.uk-badge.edit {
    background:#555;
}
.uk-input.file {
    cursor:pointer !important;
}
</style>