const db = require('../config/db');

// GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const [items] = await db.execute(
      `SELECT c.id, c.quantity, c.product_id,
              p.name, p.slug, p.price, p.image_url, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ? AND p.deleted_at IS NULL
       ORDER BY c.added_at DESC`,
      [req.user.id]
    );

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      items,
      summary: {
        itemCount: items.length,
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: subtotal > 500 ? 0 : 49,
        total: parseFloat((subtotal + (subtotal > 500 ? 0 : 49)).toFixed(2))
      }
    });
  } catch (error) { next(error); }
};

// POST /api/cart
exports.addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    if (!product_id) return res.status(400).json({ error: 'Product ID required' });

    // Check product exists and has stock
    const [products] = await db.execute(
      'SELECT id, stock FROM products WHERE id = ? AND deleted_at IS NULL', [product_id]
    );
    if (products.length === 0) return res.status(404).json({ error: 'Product not found' });
    if (products[0].stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    // Upsert cart item
    await db.execute(
      `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [req.user.id, product_id, quantity, quantity]
    );

    res.status(201).json({ message: 'Added to cart' });
  } catch (error) { next(error); }
};

// PATCH /api/cart/:id
exports.updateQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ error: 'Valid quantity required' });

    const [result] = await db.execute(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Cart updated' });
  } catch (error) { next(error); }
};

// DELETE /api/cart/:id
exports.removeFromCart = async (req, res, next) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (error) { next(error); }
};

// DELETE /api/cart (clear all)
exports.clearCart = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (error) { next(error); }
};
