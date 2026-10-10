import client from './client';

export const authApi = {
  login: (payload) => client.post('/auth/login', payload),
  me: () => client.get('/auth/me'),
  changePassword: (payload) => client.post('/auth/change-password', payload),
};

export const dashboardApi = { get: () => client.get('/dashboard') };

export const employeeApi = {
  list: (params) => client.get('/employees', { params }),
  team: (params) => client.get('/employees/team', { params }),
  create: (payload) => client.post('/employees', payload),
  update: (id, payload) => client.put(`/employees/${id}`, payload),
  remove: (id) => client.delete(`/employees/${id}`),
  departments: () => client.get('/departments'),
};

export const attendanceApi = {
  today: () => client.get('/attendance/today'),
  checkIn: () => client.post('/attendance/check-in'),
  checkOut: () => client.post('/attendance/check-out'),
  mine: (params) => client.get('/attendance/me', { params }),
  team: (params) => client.get('/attendance/team', { params }),
};

export const leaveApi = {
  apply: (payload) => client.post('/leaves', payload),
  mine: (params) => client.get('/leaves/me', { params }),
  cancel: (id) => client.delete(`/leaves/${id}`),
  requests: (params) => client.get('/leaves/requests', { params }),
  review: (id, payload) => client.patch(`/leaves/${id}/review`, payload),
};
