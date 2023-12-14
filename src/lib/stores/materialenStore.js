// src/lib/stores/materialenStore.js

import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

// globally disable auto cancellation
// https://github.com/pocketbase/js-sdk#auto-cancellation
pb.autoCancellation(false);

// Initial state
const initialState = [];

// Create the store
const materialenStore = writable(initialState);

// Fetch all 'materialen'
async function fetchMaterialen() {
  const options = {
    sort: 'created',
    expand: 'leerlijn,les' // Passed 'leerlijn' to the expand property
  };
  const materialen = await pb.collection('materialen').getFullList(options);
  materialenStore.set(materialen);
}

// Create a new 'materiaal'
async function createMateriaal(data) {
  try {
    const record = await pb.collection('materialen').create(data);
    fetchMaterialen();  // Fetch the updated list of 'materialen'
    return record; // Return the newly added materiaal
  } catch (error) {
    throw error;  // Propagate the error to the caller
  }
}

// Update a 'materiaal'
async function updateMateriaal(materiaalId, data) {
  try {
    const updatedMateriaal = await pb.collection('materialen').update(materiaalId, data);
    fetchMaterialen();  // Fetch the updated list of 'materialen' after an update
    return updatedMateriaal; // Return the updated materiaal
  } catch (error) {
    throw error;  // Re-throw the error to the caller
  }
}

// Delete a 'materiaal'
async function deleteMateriaal(materiaalId) {
  try {
    await pb.collection('materialen').delete(materiaalId);
    fetchMaterialen();  // Fetch the updated list of 'materialen' after a delete operation
  } catch (error) {
    throw error;  // Re-throw the error to the caller
  }
}

// Export the store and the functions to manipulate it
export default {
  subscribe: materialenStore.subscribe,
  createMateriaal,
  fetchMaterialen,
  updateMateriaal,
  deleteMateriaal
};
