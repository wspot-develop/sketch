export const API_URL = import.meta.env.VITE_API_URL;

export const login = async (login: string, pws_app: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, pws_app }),
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}

export const register = async (login: string, pws_app: string, name: string) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, pws_app, name }),
  });
  return response.json();
}
