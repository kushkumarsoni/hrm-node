import { useEffect, useState } from 'react';
import { attendanceApi } from '../api/services';
import { Badge, Pager, fmtMinutes, fmtTime } from '../components/ui';

export default function TeamAttendance() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    attendanceApi.team({ page, ...(date && { date }) }).then((r) => { setRows(r.data); setMeta(r.meta); });
  }, [date, page]);

  return (
    <>
      <div className="page-head">
        <h2>Team Attendance</h2>
        <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setPage(1); }} title="Leave empty for today" />
      </div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Check In</th><th>Check Out</th><th>Worked</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>{a.user?.name}<div className="muted small">{a.user?.employee_code}</div></td>
                <td>{fmtTime(a.check_in)}</td><td>{fmtTime(a.check_out)}</td><td>{fmtMinutes(a.work_minutes)}</td>
                <td><Badge value={a.status} /></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="5" className="muted">No attendance records for this date</td></tr>}
          </tbody>
        </table>
        <Pager meta={meta} onChange={setPage} />
      </div>
    </>
  );
}
