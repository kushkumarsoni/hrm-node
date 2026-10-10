import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/ui';

const cards = {
  admin: [
    ['totalEmployees', 'Total Employees'], ['activeEmployees', 'Active Employees'], ['departments', 'Departments'],
    ['presentToday', 'Present Today'], ['onLeaveToday', 'On Leave Today'], ['pendingLeaves', 'Pending Leave Requests'],
  ],
  manager: [
    ['teamSize', 'Team Size'], ['presentToday', 'Team Present Today'], ['onLeaveToday', 'Team On Leave'], ['pendingLeaves', 'Pending Approvals'],
  ],
  employee: [
    ['presentThisMonth', 'Days Present (This Month)'], ['pendingLeaves', 'Pending Leaves'], ['approvedLeaveDaysThisYear', 'Leave Days Taken (This Year)'],
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => { dashboardApi.get().then((r) => setData(r.data)); }, []);

  return (
    <>
      <h2>Welcome, {user.name}</h2>
      {!data ? <p>Loading...</p> : (
        <div className="grid">
          {user.role === 'employee' && (
            <StatCard label="Today" value={data.checkedOut ? 'Checked out' : data.checkedIn ? 'Checked in' : 'Not checked in'} />
          )}
          {cards[user.role].map(([key, label]) => <StatCard key={key} label={label} value={data[key]} />)}
        </div>
      )}
    </>
  );
}
