export const API_URL = import.meta.env.VITE_API_URL;

export const login = async (login: string, pws_app: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, pws_app }),
  });
  const responseJson = await response.json();
  localStorage.setItem('token', responseJson.data.token);
  localStorage.setItem('user_id', responseJson.data.user.id);
  return responseJson.data;
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

export const getUserById = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export const updateUser = async (id: string, data: unknown) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export const getCars = async () => {
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/${user_id}/cars`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export const createCar = async (carData: unknown) => {
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/${user_id}/cars`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carData),
  });
  return response.json();
}

export const getCar = async (vehicle_id: string) => {
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/${user_id}/cars/${vehicle_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export const createBooking = async (bookingData: unknown) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
  return response.json();
}

export const getBookings = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
}

export const findAvailableSpots = async (lat: string, lng: string, distance: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/search-bookings-by-lat-lng?latitude=${lat}&longitude=${lng}&distance=${distance}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  const dataJson = await response.json();
  return dataJson.bookings;
}

