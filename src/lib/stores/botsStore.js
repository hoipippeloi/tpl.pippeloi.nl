
// src/lib/stores/botsStore.js

import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

pb.autoCancellation(false);

const initialState = [];

const botsStore = writable(initialState);

async function fetchBots() {
  const bots = await pb.collection('ai_bots').getFullList({ sort: '-created' });
  botsStore.set(bots);
}

async function createBot(data) {
  try {
    const record = await pb.collection('ai_bots').create(data);
    fetchBots();  
    return record; 
  } catch (error) {
    throw error;  
  }
}

async function updateBot(botId, data) {
  try {
    const updatedBot = await pb.collection('ai_bots').update(botId, data);
    fetchBots();
    return updatedBot;
  } catch (error) {
    throw error;
  }
}

async function deleteBot(botId) {
  try {
    await pb.collection('ai_bots').delete(botId);
    fetchBots();
  } catch (error) {
    throw error;
  }
}

export default {
  subscribe: botsStore.subscribe,
  createBot,
  fetchBots,
  updateBot,
  deleteBot
};

