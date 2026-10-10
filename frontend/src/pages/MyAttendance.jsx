import { useCallback, useEffect, useState } from 'react';
import { attendanceApi } from '../api/services';
import { Alert, Badge, fmtMinutes, fmtTime } from '../components/ui';

export default function MyAttendance() {
  const [today, setToday] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    attendanceApi.today().then((r) => setToday(r.data));
    attendanceApi.mine().then((r) => setRows(r.data));
  }, []);
  useEffect(() => { load(); }, [load]);

  const act = async (fn) => {
    setBusy(true); setError('');
    try { await fn(); load(); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <>
      <h2>My Attendance</h2>
      <div className="card">
        <Alert>{error}</Alert>
        <p>
          Today: <strong>{!today ? 'Not checked in' : today.check_out ? 'Day completed' : 'Checked in'}</strong>
          {today && <span className="muted"> — In: {fmtTime(today.check_in)} Out: {fmtTime(today.check_out)}</span>}
        </p>
        <div className="actions">
          <button className="btn" disabled={busy || !!today} onClick={() => act(attendanceApi.checkIn)}>Check In</button>
          <button className="btn btn-light" disabled={busy || !today || !!today?.check_out} onClick={() => act(attendanceApi.checkOut)}>Check Out</button>
        </div>
      </div>

      <div className="card table-wrap">
        <h3>This Month</h3>
        <table>
          <thead><tr><th>Date</th><th>In</th><th>Out</th><th>Worked</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}><td>{a.date}</td><td>{fmtTime(a.check_in)}</td><td>{fmtTime(a.check_out)}</td><td>{fmtMinutes(a.work_minutes)}</td><td><Badge value={a.status} /></td></tr>
            ))}
            {!rows.length && <tr><td colSpan="5" className="muted">No records yet</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
