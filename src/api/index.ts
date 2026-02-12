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

export const getCar = async (car_id: string) => {
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/${user_id}/cars/${car_id}`, {
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

export const getBookings = async (bookingData: unknown) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
  return response.json();
}