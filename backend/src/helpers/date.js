const { app } = require('../config');

/** Today's date (YYYY-MM-DD) in the application's timezone. */
exports.today = () => new Date().toLocaleDateString('en-CA', { timeZone: app.timezone });

/** Inclusive number of days between two YYYY-MM-DD dates. */
exports.daysBetween = (from, to) => {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  return Math.round((b - a) / 86400000) + 1;
};

exports.diffInMinutes = (start, end) => Math.max(Math.round((new Date(end) - new Date(start)) / 60000), 0);

/** First & last day (YYYY-MM-DD) of a "YYYY-MM" month, defaults to current month. */
exports.monthRange = (month) => {
  const base = month && /^\d{4}-\d{2}$/.test(month) ? month : exports.today().slice(0, 7);
  const [y, m] = base.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { start: `${base}-01`, end: `${base}-${String(last).padStart(2, '0')}` };
};
