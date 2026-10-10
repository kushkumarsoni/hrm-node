export const Alert = ({ type = 'error', children }) =>
  children ? <div className={`alert alert-${type}`}>{children}</div> : null;

export const StatCard = ({ label, value }) => (
  <div className="card stat">
    <div className="stat-value">{value ?? '-'}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export const Badge = ({ value }) => <span className={`badge badge-${value}`}>{String(value).replace('_', ' ')}</span>;

export const Pager = ({ meta, onChange }) =>
  meta && meta.last_page > 1 ? (
    <div className="pager">
      <button className="btn btn-light" disabled={meta.page <= 1} onClick={() => onChange(meta.page - 1)}>Prev</button>
      <span>Page {meta.page} / {meta.last_page}</span>
      <button className="btn btn-light" disabled={meta.page >= meta.last_page} onClick={() => onChange(meta.page + 1)}>Next</button>
    </div>
  ) : null;

export const fmtTime = (v) => (v ? new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-');
export const fmtMinutes = (m) => (m ? `${Math.floor(m / 60)}h ${m % 60}m` : '-');
