// src/lib/stores/leerlijnenStore.js

import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

// globally disable auto cancellation
// https://github.com/pocketbase/js-sdk#auto-cancellation
pb.autoCancellation(false);

// Initial state
const initialState = [];

// Create the store
const leerlijnenStore = writable(initialState);

// Fetch all 'leerlijnen'
async function fetchLeerlijnen() {
  const leerlijnen = await pb.collection('leerlijnen').getFullList({ sort: 'volgorde_nummer,-created' });
  leerlijnenStore.set(leerlijnen);
}

// Create a new 'leerlijn'
async function createLeerlijn(data) {
  try {
    const record = await pb.collection('leerlijnen').create(data);
    fetchLeerlijnen();  // Fetch the updated list of 'leerlijnen'
    return record; // Return the newly added leerlijn
  } catch (error) {
    throw error;  // Propagate the error to the caller
  }
}

// Update a 'leerlijn'
async function updateLeerlijn(leerlijnId, data) {
  try {
    const updatedLeerlijn = await pb.collection('leerlijnen').update(leerlijnId, data);
    fetchLeerlijnen();  // Fetch the updated list of 'leerlijnen' after an update
    return updatedLeerlijn; // Return the updated leerlijn
  } catch (error) {
    throw error;  // Re-throw the error to the caller
  }
}

// Delete a 'leerlijn'
async function deleteLeerlijn(leerlijnId) {
  try {
    await pb.collection('leerlijnen').delete(leerlijnId);
    fetchLeerlijnen();  // Fetch the updated list of 'leerlijnen' after a delete operation
  } catch (error) {
    throw error;  // Re-throw the error to the caller
  }
}


// Export the store and the functions to manipulate it
export default {
  subscribe: leerlijnenStore.subscribe,
  createLeerlijn,
  fetchLeerlijnen,
  updateLeerlijn,
  deleteLeerlijn
};
