// src/api/index.ts
// Use relative base so Vite dev proxy or production proxy handles the target
const BASE = "/api";

// -------- AUTH ----------
export const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(name: string, email: string, password: string) {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },

  async me(token: string) {
    const res = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // -------- MEALS ----------
  async getMeals(date: string, token: string) {
    const res = await fetch(`${BASE}/meals?date=${date}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  async addMeal(data: any, token: string) {
    const res = await fetch(`${BASE}/meals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteMeal(id: string, token: string) {
    const res = await fetch(`${BASE}/meals/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json().catch(() => ({}));
  },

  // -------- WORKOUTS ----------
  async getWorkouts(token: string) {
    const res = await fetch(`${BASE}/workouts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // -------- SUPPLEMENTS ----------
  async getSupplements(token: string) {
    const res = await fetch(`${BASE}/supplements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // -------- POSTS (Community) ----------
  async getPosts(token: string) {
    const res = await fetch(`${BASE}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  }

  
};

// add near other api functions in src/api/index.ts
export async function updateProfile(profile: any, token?: string) {

  const payload = {
    ...profile,
    height: profile.height ? Number(profile.height) : undefined,
    weight: profile.weight ? Number(profile.weight) : undefined,
    age: profile.age ? Number(profile.age) : undefined,
    isOnboarded: profile.isOnboarded ?? true
  };

  const res = await fetch(`${BASE}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),   // ⭐ FIXED ⭐
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Update profile failed (${res.status})`);
  }

  return res.json();
}
