export async function api(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": navigator.language,
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

 const text = await response.text();
 const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
