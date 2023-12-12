<script>
  import { onMount } from 'svelte';
  import PocketBase from 'pocketbase';

  let pb;
  let username = '';
  let password = '';
  let isAuthenticated = false;
  let isAuthorized = false;
  let errorMessage = '';

  onMount(async () => {
    isAuthenticated = Boolean(window.localStorage.getItem('auth'));
    isAuthorized = Boolean(window.localStorage.getItem('authorized'));

    pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

    if (isAuthenticated && isAuthorized) {
      // Here you might want to logic to handle actions based if the user is already authenticated and authorized
    }
  });

  async function loginWithCredentials() {
    const authRecord = await pb.collection('users').authWithPassword(username, password);
    if(authRecord) {
      localStorage.setItem('auth', 'true'); // save authentication state
      isAuthenticated = true;
      isAuthorized = true;
      localStorage.setItem('authorized', 'true'); // save authorization state
      localStorage.setItem('auth_data', JSON.stringify(authRecord));
      console.log('auth:', authRecord)
    } else {
      errorMessage = 'E-mail of wachtwoord onjuist!';
    }
  }
</script>
  
  {#if !isAuthenticated}

        <div class="uk-section uk-section-muted uk-flex uk-flex-middle uk-animation-fade" uk-height-viewport>
            <div class="uk-width-1-1">
                <div class="uk-container">
                    <div class="uk-grid-margin uk-grid uk-grid-stack" uk-grid>
                        <div class="uk-width-1-1@m">
                            <div class="uk-margin uk-width-large uk-margin-auto uk-card uk-card-default uk-card-body uk-box-shadow-large">
                                <h3 class="uk-card-title uk-text-center">Welkom terug!</h3>
                                <form on:submit|preventDefault={loginWithCredentials}>
                                    <div class="uk-margin">
                                        <div class="uk-inline uk-width-1-1">
                                            <span class="uk-form-icon" uk-icon="icon: mail"></span>
                                            <input style="border:1px solid #999;font-size:0.9em !important;"
                                                class="uk-input"
                                                bind:value={username}
                                                type="email"
                                                name="email"
                                                placeholder="naam@domein.nl"
                                                required
                                                aria-label="Not clickable icon"
                                            >
                                        </div>
                                    </div>
                                    <div class="uk-margin">
                                        <div class="uk-inline uk-width-1-1">
                                            <span class="uk-form-icon" uk-icon="icon: lock"></span>
                                            <input style="border:1px solid #999;font-size:0.9em !important;"
                                                class="uk-input"
                                                bind:value={password}
                                                type="password"
                                                name="password"
                                                placeholder="je wachtwoord"
                                                required
                                                aria-label="Not clickable icon"
                                            >
                                        </div>
                                    </div>
                                    <div class="uk-margin">
                                        <button class="uk-button uk-button-primary uk-button-large uk-width-1-1">Login</button>
                                    </div>
                                    <!--
                                    <div class="uk-text-small uk-text-center">
                                        Not registered? <a href="#">Create an account</a>
                                    </div>
                                    -->
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    <p>{errorMessage}</p>

  <!--
  <div class="uk-flex uk-flex-center uk-padding">
    <button
          class="uk-button uk-button-secondary uk-button-small"
          on:click={loginWithGoogle}
          style="font-size:0.8em !important;"
      >Login met Google</button>
  </div>
  -->

  {:else if isAuthenticated && !isAuthorized}
  <div class="uk-flex uk-flex-center">
    <div class="uk-card uk-card-default uk-card-body" style="margin-top:10%;text-align:center;">
      <h4 style="font-size:1em !important;">Je account is nog niet geautoriseerd door de beheerder.</h4>
      <p>Je hebt pas toegang nadat dit verleend is.</p>
    </div>
  </div>
  {:else if isAuthorized}
  <div>
    <slot />
  </div>
  {/if}
  