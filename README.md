# Sveltekit - Pocketbase - UIkit - Starterkit

This is a starterkit (template app) where we bundled:

- [Sveltekit](https://kit.svelte.dev/)
- [Pocketbase](https://pocketbase.io/) on [Pockethost](https://pockethost.io/)
- [UIkit](https://getuikit.com/)

This combination of frameworks and database is suitable for SMB web apps.

## Usage

Download or git clone this repo. 

Open your CLI in the folder where you downloaded and unpacked the files.

Use: npm install -> to install all dependencies

Use: npm run dev -> to start the app

Use: npm run build -> to build your app and be able to host it where you like


## Config

To make this app work there are a few simple things to do.

### Routes

Routes will be autogenerated based on the folders in /src/routes/ that contain a +page.svelte file. So everytime you 
create a folder with a +page.svelte file in it, that route will be auto displayed in the sidebar.

### Environment variables

To make the app work with the data you need a pocketbase instance somewhere. We host ours on [pockethost](https://pockethost.io/).

Create a .env file with an entry: 

VITE_POCKETBASE_URL=https://myinstance.pockethost.io/

After adding this, your app is almost ready to use.

Next, create a pocketbase instance and use the url of that instance in the .env file. Then you first create a user manually in the pocketbase users collection. 
After that you can log in to this app with that account.

#### Demo

You can see a demo at [https://tpl.pippeloi.nl](https://tpl.pippeloi.nl).

Log in with user@user.com / user0987.


*This bundle was created by Patrick Tehubijuluw (creatuluw at gmail dot com).*