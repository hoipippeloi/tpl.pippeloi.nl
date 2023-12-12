// src/lib/stores/userStore.js

import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://vdm.pockethost.io');

// globally disable auto cancellation
// https://github.com/pocketbase/js-sdk#auto-cancellation
pb.autoCancellation(false);

// Initial state
const initialState = [];

// Create the store
const userStore = writable(initialState);

// Fetch all users
async function fetchUsers() {
  const users = await pb.collection('users').getFullList({ sort: '-verified,-created' });
  userStore.set(users);
}

// Create a new user
async function createUser(data) {
  try {
    const record = await pb.collection('users').create(data);
    fetchUsers();  // Fetch the updated list of users
    return record; // Return the newly added user
  } catch (error) {
    throw error;  // Propagate the error to the caller
  }
}

// Update a user
async function updateUser(userId, data) {
  try {
    const updatedUser = await pb.collection('users').update(userId, data);
    fetchUsers();  // Fetch the updated list of users after an update
    return updatedUser; // Return the updated user
  } catch (error) {
    throw error;  // Re-throw the error to the caller
  }
}

// Delete a user
async function deleteUser(userId) {
  try {
    await pb.collection('users').delete(userId);
    fetchUsers();  // Fetch the updated list of users after deleting
  } catch (error) {
    throw error;  // Re-throw the error to the caller
  }
}


// Export the store and the functions to manipulate it
export default {
  subscribe: userStore.subscribe,
  createUser,
  fetchUsers,
  updateUser,
  deleteUser
};
