export const menu = [
  { label: 'Dashboard', path: '/', roles: ['admin', 'manager', 'employee'] },
  { label: 'Employees', path: '/employees', roles: ['admin'] },
  { label: 'My Team', path: '/team', roles: ['manager'] },
  { label: 'Team Attendance', path: '/team-attendance', roles: ['admin', 'manager'] },
  { label: 'Leave Requests', path: '/leave-requests', roles: ['admin', 'manager'] },
  { label: 'My Attendance', path: '/attendance', roles: ['manager', 'employee'] },
  { label: 'My Leaves', path: '/leaves', roles: ['manager', 'employee'] },
];
