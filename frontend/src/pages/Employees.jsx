import { useCallback, useEffect, useState } from 'react';
import { employeeApi } from '../api/services';
import { Alert, Badge, Pager } from '../components/ui';

const empty = { name: '', email: '', password: '', role: 'employee', phone: '', designation: '', joining_date: '', department_id: '', manager_id: '' };

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({ search: '', role: '', page: 1 });
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState(null); // null = closed
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const load = useCallback(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    employeeApi.list(params).then((r) => { setRows(r.data); setMeta(r.meta); });
  }, [filters]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    employeeApi.departments().then((r) => setDepartments(r.data));
    employeeApi.list({ role: 'manager', status: 'active', limit: 100 }).then((r) => setManagers(r.data));
  }, []);

  const openCreate = () => { setForm(empty); setEditingId(null); setError(''); setFieldErrors({}); };
  const openEdit = (u) => {
    setForm({
      name: u.name, email: u.email, password: '', role: u.role, phone: u.phone || '', designation: u.designation || '',
      joining_date: u.joining_date || '', department_id: u.department_id || '', manager_id: u.manager_id || '', status: u.status,
    });
    setEditingId(u.id); setError(''); setFieldErrors({});
  };

  const save = async (e) => {
    e.preventDefault();
    setError(''); setFieldErrors({});
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? (['department_id', 'manager_id', 'joining_date'].includes(k) ? null : v) : v])
    );
    if (editingId && !payload.password) delete payload.password;
    ['phone', 'designation'].forEach((k) => { if (payload[k] === '') payload[k] = null; });

    try {
      editingId ? await employeeApi.update(editingId, payload) : await employeeApi.create(payload);
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
      setFieldErrors(err.errors || {});
    }
  };

  const deactivate = async (u) => {
    if (!window.confirm(`Deactivate ${u.name}?`)) return;
    try { await employeeApi.remove(u.id); load(); } catch (err) { alert(err.message); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const err = (k) => fieldErrors[k] && <small className="field-error">{fieldErrors[k][0]}</small>;

  return (
    <>
      <div className="page-head">
        <h2>Employees</h2>
        <button className="btn" onClick={openCreate}>+ Add Employee</button>
      </div>

      <div className="card filters">
        <input placeholder="Search name / email / code" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}>
          <option value="">All roles</option><option value="admin">Admin</option><option value="manager">Manager</option><option value="employee">Employee</option>
        </select>
      </div>

      {form && (
        <form className="card form-grid" onSubmit={save}>
          <h3 className="span-2">{editingId ? 'Edit Employee' : 'New Employee'}</h3>
          <div className="span-2"><Alert>{error}</Alert></div>
          <div><label>Name</label><input required value={form.name} onChange={set('name')} />{err('name')}</div>
          <div><label>Email</label><input type="email" required value={form.email} onChange={set('email')} />{err('email')}</div>
          <div><label>Password {editingId && '(leave blank to keep)'}</label><input type="password" required={!editingId} value={form.password} onChange={set('password')} />{err('password')}</div>
          <div><label>Role</label>
            <select value={form.role} onChange={set('role')}><option value="employee">Employee</option><option value="manager">Manager</option><option value="admin">Admin</option></select>
          </div>
          <div><label>Phone</label><input value={form.phone} onChange={set('phone')} />{err('phone')}</div>
          <div><label>Designation</label><input value={form.designation} onChange={set('designation')} /></div>
          <div><label>Joining Date</label><input type="date" value={form.joining_date} onChange={set('joining_date')} /></div>
          <div><label>Department</label>
            <select value={form.department_id} onChange={set('department_id')}>
              <option value="">— None —</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div><label>Reporting Manager</label>
            <select value={form.manager_id} onChange={set('manager_id')}>
              <option value="">— None —</option>{managers.filter((m) => m.id !== editingId).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>{err('manager_id')}
          </div>
          {editingId && (
            <div><label>Status</label>
              <select value={form.status} onChange={set('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select>
            </div>
          )}
          <div className="span-2 actions">
            <button className="btn">Save</button>
            <button type="button" className="btn btn-light" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Code</th><th>Name</th><th>Role</th><th>Department</th><th>Manager</th><th>Status</th><th /></tr></thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>{u.employee_code}</td>
                <td>{u.name}<div className="muted small">{u.email}</div></td>
                <td>{u.role}</td>
                <td>{u.department?.name || '-'}</td>
                <td>{u.manager?.name || '-'}</td>
                <td><Badge value={u.status} /></td>
                <td className="actions">
                  <button className="btn btn-light" onClick={() => openEdit(u)}>Edit</button>
                  {u.status === 'active' && <button className="btn btn-danger" onClick={() => deactivate(u)}>Deactivate</button>}
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="7" className="muted">No employees found</td></tr>}
          </tbody>
        </table>
        <Pager meta={meta} onChange={(page) => setFilters({ ...filters, page })} />
      </div>
    </>
  );
}
