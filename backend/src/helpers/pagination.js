exports.getPagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  return { page, limit, offset: (page - 1) * limit };
};

exports.buildMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  last_page: Math.max(Math.ceil(total / limit), 1),
});
