// ================= UPLOAD PHOTO =================
export async function apiUploadPhoto(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append('photo', file);

  const res = await fetch(`${API_BASE_URL}/users/upload-photo`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: formData,
  });

  return parseApiResponse(res, 'Photo upload failed');
}
// ================= BASE CONFIG =================
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user?.token;
}

async function parseApiResponse(res, fallbackMessage = "API error") {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || fallbackMessage);
    return json;
  }

  const text = await res.text();
  const message = text.startsWith("<!DOCTYPE")
    ? `${fallbackMessage}: server returned an HTML page instead of JSON`
    : text || fallbackMessage;

  throw new Error(message);
}

// ================= ANALYZE EXPENSES =================
export async function analyzeExpenses(expenses, inputExpense = null) {
  const expenseList = Array.isArray(expenses) ? expenses : [];
  const res = await fetch(`${API_BASE_URL}/analysis/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
    },
    body: JSON.stringify({ expenses: expenseList, inputExpense }),
  });

  return parseApiResponse(res, "Analysis failed");
}

// ================= GET =================
export async function apiGet(path) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return parseApiResponse(res, "API error");
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

  return parseApiResponse(res, "API error");
}

// ================= PUT (FIXED) =================
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

  return parseApiResponse(res, "Update failed");
}

// ================= DELETE =================
export async function apiDelete(path) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return parseApiResponse(res, "Delete failed");
}
