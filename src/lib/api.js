// ================= BASE CONFIG =================
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
}

// ================= ANALYZE EXPENSES =================
export async function analyzeExpenses(expenses) {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
    },
    body: JSON.stringify({ expenses }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "API error");
  return json;
}

// ================= GET =================
export async function apiGet(path) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "API error");
  return json;
}

// ================= POST =================
export async function apiPost(path, data) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "API error");
  return json;
}

// PUT (FIXED) 
export async function apiPut(path, data) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Update failed");
  return json;
}

//  DELETE
export async function apiDelete(path) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Delete failed");
  return json;
}
