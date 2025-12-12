const API_URL = "http://127.0.0.1:8000";

export function api(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    return fetch(API_URL + path, {
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        ...options,
    });
}
