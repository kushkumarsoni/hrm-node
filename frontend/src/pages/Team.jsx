import { useEffect, useState } from 'react';
import { employeeApi } from '../api/services';
import { Badge, Pager } from '../components/ui';

export default function Team() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => { employeeApi.team({ page }).then((r) => { setRows(r.data); setMeta(r.meta); }); }, [page]);

  return (
    <>
      <h2>My Team</h2>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Code</th><th>Name</th><th>Designation</th><th>Phone</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>{u.employee_code}</td><td>{u.name}<div className="muted small">{u.email}</div></td>
                <td>{u.designation || '-'}</td><td>{u.phone || '-'}</td><td><Badge value={u.status} /></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="5" className="muted">No team members assigned to you</td></tr>}
          </tbody>
        </table>
        <Pager meta={meta} onChange={setPage} />
      </div>
    </>
  );
}
