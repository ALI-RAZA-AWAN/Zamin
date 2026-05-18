// src/api.js
const BASE_URL = 'http://localhost:5000/api'; // Your Python/Flask backend entry point

export const API = {
  // Authentication Routes
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },
  
  registerBuyer: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register-buyer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  registerManufacturer: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register-manufacturer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Sourcing Directory Routes
  getFactories: async () => {
    const res = await fetch(`${BASE_URL}/factories`);
    return res.json();
  },

  // Order & Proposal Communication Flow
  createOrderProposal: async (orderData) => {
    const res = await fetch(`${BASE_URL}/orders/proposal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  getBuyerOrders: async (buyerId) => {
    const res = await fetch(`${BASE_URL}/orders/buyer/${buyerId}`);
    return res.json();
  },

  getManufacturerOrders: async (factoryId) => {
    const res = await fetch(`${BASE_URL}/orders/manufacturer/${factoryId}`);
    return res.json();
  },

  updateProductionStage: async (orderId, stageIndex) => {
    const res = await fetch(`${BASE_URL}/orders/${orderId}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageIndex })
    });
    return res.json();
  }
};