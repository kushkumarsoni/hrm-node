import { useCallback, useEffect, useState } from 'react';
import { leaveApi } from '../api/services';
import { Badge, Pager } from '../components/ui';

export default function LeaveRequests() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    leaveApi.requests({ page, ...(status && { status }) }).then((r) => { setRows(r.data); setMeta(r.meta); });
  }, [page, status]);
  useEffect(() => { load(); }, [load]);

  const review = async (id, decision) => {
    const note = decision === 'rejected' ? window.prompt('Reason for rejection (optional)') : '';
    if (note === null) return;
    try { await leaveApi.review(id, { status: decision, note }); load(); } catch (err) { alert(err.message); }
  };

  return (
    <>
      <div className="page-head">
        <h2>Leave Requests</h2>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="">All</option>
        </select>
      </div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th /></tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td>{l.user?.name}<div className="muted small">{l.user?.employee_code}</div></td>
                <td>{l.type}</td><td>{l.from_date} → {l.to_date}</td><td>{l.days}</td><td>{l.reason}</td>
                <td><Badge value={l.status} />{l.reviewer && <div className="muted small">by {l.reviewer.name}</div>}</td>
                <td className="actions">
                  {l.status === 'pending' && (
                    <>
                      <button className="btn" onClick={() => review(l.id, 'approved')}>Approve</button>
                      <button className="btn btn-danger" onClick={() => review(l.id, 'rejected')}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="7" className="muted">Nothing here</td></tr>}
          </tbody>
        </table>
        <Pager meta={meta} onChange={setPage} />
      </div>
    </>
  );
}
