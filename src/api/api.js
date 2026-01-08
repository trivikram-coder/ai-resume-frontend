const BASE_URL = "https://resume.vkstore.site";

export async function registerUser(data) {
  return fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function loginUser(data) {
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function uploadResume(email, file, description) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", description);

  return fetch(`${BASE_URL}/api/resume/upload/${email}`, {
    method: "POST",
    body: formData
  }).then(res => res.json());
}

export async function getReports(email) {
  try {
    const response = await fetch(`${BASE_URL}/api/resume/report/${email}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reports:", error);
    return { status: false, message: error.message || "Failed to fetch reports" };
  }
}

export async function deleteReport(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/resume/delete/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting report:", error);
    return { status: false, message: error.message || "Failed to delete report" };
  }
}
