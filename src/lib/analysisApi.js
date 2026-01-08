export async function analyzeExpenses(expenses) {
  const res = await fetch("http://127.0.0.1:7000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expenses }),
  });

  if (!res.ok) {
    throw new Error("Analysis failed");
  }

  return await res.json();
}
