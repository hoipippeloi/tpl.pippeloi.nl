<script>
    import { onMount, onDestroy } from 'svelte';
    import userStore from '$lib/stores/userStore';
    import "$lib/css/roles.css";

    let email = '';
    let username = '';
    let password = '';
    let passwordConfirm = "";
    let name = '';
    let telefoon = '';
    let role = '';
    let emailVisibility = true;
    let avatar = null;
    let active = true;
    let isSuccessMessageVisible = false;
    let isFormVisible = true;
    let emailTaken = false;
    let usernameTaken = false;
    let allUsers = [];

    const unsubscribe = userStore.subscribe(users => {
        allUsers = users;
    });

    onMount(async () => {
        console.log("Attempting to fetch users...");
        try {
            await userStore.fetchUsers();
            console.log("Users fetched successfully");
        } catch (error) {
            console.error("An error occurred while fetching users: ", error);
        }
    });

    const checkEmailAvailability = (enteredEmail) => {
        emailTaken = !!allUsers.find(user => user.email === enteredEmail);
    };

    const checkUsernameAvailability = (enteredUsername) => {
        usernameTaken = !!allUsers.find(user => user.username === enteredUsername);
    };
    
    $: {
        checkEmailAvailability(email);
        checkUsernameAvailability(username);
    }

    const createUser = async () => {

        if (emailTaken || usernameTaken) {
            console.log('emailTaken:', emailTaken);
            console.log('usernameTaken:', usernameTaken);
            return;
        }

        const data = {
            username,
            email,
            password,
            passwordConfirm,
            name,
            telefoon,
            role,
            avatar,
            emailVisibility,
            active,
        };

        //console.log('data:', data);

        try {
            await userStore.createUser(data);
            //console.log(data);
            isSuccessMessageVisible = true;
            setTimeout(() => {
                resetForm();
            }, 1500);   
        } catch (error) {
            console.log(error);
        }
    };


    const resetForm = () => {
        email = '';
        username = '';
        password = '';
        passwordConfirm = '';
        name = '';
        telefoon = '';
        role = '';
        avatar = null;
        emailVisibility = true;
        active = true;
        emailTaken = false;
        usernameTaken = false;
        isSuccessMessageVisible = false;
        };

        const handleImageUpload = (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            if (imageFile.size > 4 * 1024 * 1024) {
            alert("Image size must be less than 4MB");
            return;
            }
            avatar = imageFile;
        }
    };

    onDestroy(unsubscribe);

</script>
    


{#if isSuccessMessageVisible}

    <div class="uk-alert-success" uk-alert>
        <a href class="uk-alert-close" uk-close></a>
        <p>Medewerker succesvol aangemaakt.</p>
    </div>

{/if}

{#if isFormVisible}

<form class="uk-grid-small uk-width-1-2" on:submit|preventDefault={createUser} uk-grid>

    <div class="uk-width-1-1">
        <label class="uk-form-label" for="email">E-mail</label>
        <input bind:value={email} id="email" type="email" class="uk-input" required />
            {#if email && !emailTaken}
                <p>Email is available.</p>
            {:else if email && emailTaken}
                <p>Email is already taken.</p>
            {/if}
    </div>

    <div class="uk-width-1-1">
        <label class="uk-form-label" for="username">Gebruikersnaam</label>
        <input bind:value={username} id="username" type="text" class="uk-input" required />
            {#if username && !usernameTaken}
                <p>Username is available.</p>
            {:else if username && usernameTaken}
                <p>Username is already taken.</p>
            {/if}
    </div>

    <div class="uk-width-1-1">
    <label class="uk-form-label" for="name">Volledige naam</label>
        <input bind:value={name} id="name" type="text" placeholder="Typ je voor- en achternaam" class="uk-input" required />
    </div>

    <div class="uk-width-1-1">
    <label class="uk-form-label" for="password">Wachtwoord</label>
        <input bind:value={password} id="password" type="password" placeholder="Typ je wachtwoord hier" class="uk-input" required />
    </div>

    <div class="uk-width-1-1">
    <label class="uk-form-label" for="passwordConfirm">Wachtwoord controle</label>
        <input bind:value={passwordConfirm} id="passwordConfirm" type="password" placeholder="Typ je wachtwoord hier nog een keer ter controle" class="uk-input" required />
    </div>

    <div class="uk-width-1-1">
    <label class="uk-form-label" for="telefoon">Telefoon</label>
        <input bind:value={telefoon} id="telefoon" type="text" placeholder="Typ je telefoonnummer" class="uk-input" required />
    </div>
<!--
    <div class="uk-width-1-1">
        <label class="uk-form-label" for="avatar">Avatar</label>
        <input id="avatar" type="file" accept="image/*" class="uk-input" required on:change={handleImageUpload}/>
        <p class="uk-form-help-text">Image must be square and no more than 2 MB</p>
    </div>
-->
    <div uk-form-custom="target: true" style="width:100%;">
        <label class="uk-form-label" for="telefoon">Je profiel foto</label>
        <input type="file" aria-label="Custom controls" accept="image/*" required on:change={handleImageUpload}>
        <input class="uk-input uk-form-width-medium uk-width-1-1" type="text" placeholder="Selecteer een foto vanaf je apparaat" aria-label="Custom controls" disabled>
    </div>

    <div class="uk-width-1-1">
    <label class="uk-form-label" for="role">Role</label>
        <select bind:value={role} class="uk-select" id="role">
        <option value="">Choose...</option>
        <option value="admin">Admin</option>
        <option value="user">Planner</option>
        <option value="admin">User</option>
        <option value="user">Guest</option>
        </select>
    </div>

    <div class="uk-width-1-1" uk-grid>
        <!--
        <div class="uk-width-1-2">
            <div class="uk-width-1-1">
                <label class="uk-form-label" for="emailVisibility">E-mail openbaar?</label>
            </div>
            <label class="uk-switch" for="emailVisibility">
                <input type="checkbox" id="emailVisibility" bind:checked={emailVisibility}>
                <div class="uk-switch-slider"></div>
            </label>
        </div>
        -->
        <div class="uk-width-1-2">
            <div class="uk-width-1-1">
                <label class="uk-form-label" for="active">Actief?</label>
            </div>
            <label class="switch">
                <input type="checkbox" bind:checked={active}>
                <span class="slider round"></span>
            </label>
        </div>
    </div>

    <hr class="uk-width-1-1" />

    <div class="uk-width-1-1">
        <button class="uk-button uk-button-primary" type="submit">Opslaan</button>
    </div>

</form>

{/if}