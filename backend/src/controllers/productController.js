const db = require('../config/db');

// GET /api/products
exports.getAll = async (req, res, next) => {
  try {
    const { category, search, sort, order, page, limit } = req.query;
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.deleted_at IS NULL';
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sorting
    const validSorts = ['price', 'name', 'created_at', 'rating'];
    const sortBy = validSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY p.${sortBy} ${sortOrder}`;

    // Pagination
    const pageNum = parseInt(page) || 1;
    const pageSize = Math.min(parseInt(limit) || 12, 50);
    const offset = (pageNum - 1) * pageSize;
    query += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [products] = await db.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.deleted_at IS NULL';
    const countParams = [];
    if (category) { countQuery += ' AND c.slug = ?'; countParams.push(category); }
    if (search) { countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)'; countParams.push(`%${search}%`, `%${search}%`); }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:slug
exports.getBySlug = async (req, res, next) => {
  try {
    const [products] = await db.execute(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.deleted_at IS NULL`,
      [req.params.slug]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get reviews
    const [reviews] = await db.execute(
      `SELECT r.*, u.name as user_name
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ? ORDER BY r.created_at DESC LIMIT 10`,
      [products[0].id]
    );

    res.json({ product: { ...products[0], reviews } });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/featured
exports.getFeatured = async (req, res, next) => {
  try {
    const [products] = await db.execute(
      'SELECT * FROM products WHERE featured = TRUE AND deleted_at IS NULL LIMIT 8'
    );
    res.json({ products });
  } catch (error) {
    next(error);
  }
};
