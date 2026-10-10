import { useCallback, useEffect, useState } from 'react';
import { leaveApi } from '../api/services';
import { Alert, Badge, Pager } from '../components/ui';

const empty = { type: 'casual', from_date: '', to_date: '', reason: '' };

export default function MyLeaves() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const load = useCallback(() => { leaveApi.mine({ page }).then((r) => { setRows(r.data); setMeta(r.meta); }); }, [page]);
  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setFieldErrors({});
    try {
      await leaveApi.apply(form);
      setForm(empty);
      setPage(1);
      load();
    } catch (err) {
      setError(err.message); setFieldErrors(err.errors || {});
    }
  };

  const cancel = async (id) => {
    if (!window.confirm('Cancel this leave request?')) return;
    try { await leaveApi.cancel(id); load(); } catch (err) { alert(err.message); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const err = (k) => fieldErrors[k] && <small className="field-error">{fieldErrors[k][0]}</small>;

  return (
    <>
      <h2>My Leaves</h2>
      <form className="card form-grid" onSubmit={submit}>
        <h3 className="span-2">Apply for Leave</h3>
        <div className="span-2"><Alert>{error}</Alert></div>
        <div><label>Type</label>
          <select value={form.type} onChange={set('type')}><option value="casual">Casual</option><option value="sick">Sick</option><option value="paid">Paid</option></select>
        </div>
        <div />
        <div><label>From</label><input type="date" required value={form.from_date} onChange={set('from_date')} />{err('from_date')}</div>
        <div><label>To</label><input type="date" required min={form.from_date} value={form.to_date} onChange={set('to_date')} />{err('to_date')}</div>
        <div className="span-2"><label>Reason</label><textarea required rows="2" value={form.reason} onChange={set('reason')} />{err('reason')}</div>
        <div className="span-2 actions"><button className="btn">Submit Request</button></div>
      </form>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th /></tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td>{l.type}</td><td>{l.from_date}</td><td>{l.to_date}</td><td>{l.days}</td>
                <td>{l.reason}{l.review_note && <div className="muted small">Note: {l.review_note}</div>}</td>
                <td><Badge value={l.status} /></td>
                <td>{l.status === 'pending' && <button className="btn btn-light" onClick={() => cancel(l.id)}>Cancel</button>}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="7" className="muted">No leave requests</td></tr>}
          </tbody>
        </table>
        <Pager meta={meta} onChange={setPage} />
      </div>
    </>
  );
}
