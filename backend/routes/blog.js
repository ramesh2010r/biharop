const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');

// Get all published blog posts (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category;

    let query = `
      SELECT 
        bp.id,
        bp.title_hindi,
        bp.title_english,
        bp.slug,
        bp.excerpt_hindi,
        bp.excerpt_english,
        bp.featured_image_url,
        bp.category,
        bp.tags,
        bp.views,
        bp.published_at,
        a.username as author_name
      FROM Blog_Posts bp
      LEFT JOIN Admins a ON bp.author_id = a.id
      WHERE bp.status = 'published' AND bp.published_at <= NOW()
    `;

    const params = [];
    
    if (category) {
      query += ' AND bp.category = ?';
      params.push(category);
    }

    query += ' ORDER BY bp.published_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [posts] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM Blog_Posts WHERE status = "published" AND published_at <= NOW()';
    if (category) {
      countQuery += ' AND category = ?';
    }
    const [countResult] = await db.query(countQuery, category ? [category] : []);
    const total = countResult[0].total;

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [posts] = await db.query(`
      SELECT 
        bp.*,
        a.username as author_name
      FROM Blog_Posts bp
      LEFT JOIN Admins a ON bp.author_id = a.id
      WHERE bp.slug = ? AND bp.status = 'published'
    `, [slug]);

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Increment view count
    await db.query('UPDATE Blog_Posts SET views = views + 1 WHERE id = ?', [posts[0].id]);

    res.json(posts[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Get all categories (public)
router.get('/categories/all', async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT 
        bc.*,
        COUNT(bp.id) as post_count
      FROM Blog_Categories bc
      LEFT JOIN Blog_Posts bp ON bc.slug = bp.category AND bp.status = 'published'
      GROUP BY bc.id
      ORDER BY bc.name_hindi
    `);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get featured/latest posts (public)
router.get('/featured/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const [posts] = await db.query(`
      SELECT 
        id,
        title_hindi,
        title_english,
        slug,
        excerpt_hindi,
        excerpt_english,
        featured_image_url,
        published_at,
        views
      FROM Blog_Posts
      WHERE status = 'published' AND published_at <= NOW()
      ORDER BY published_at DESC
      LIMIT ?
    `, [limit]);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({ error: 'Failed to fetch featured posts' });
  }
});

// ============================================
// ADMIN ROUTES (Protected)
// ============================================

// Get all posts for admin (including drafts)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = `
      SELECT 
        bp.*,
        a.username as author_name
      FROM Blog_Posts bp
      LEFT JOIN Admins a ON bp.author_id = a.id
    `;

    const params = [];
    
    if (status) {
      query += ' WHERE bp.status = ?';
      params.push(status);
    }

    query += ' ORDER BY bp.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [posts] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM Blog_Posts';
    if (status) {
      countQuery += ' WHERE status = ?';
    }
    const [countResult] = await db.query(countQuery, status ? [status] : []);
    const total = countResult[0].total;

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create new blog post (admin)
router.post('/admin/create', authenticateAdmin, async (req, res) => {
  try {
    const {
      title_hindi,
      title_english,
      slug,
      content_hindi,
      content_english,
      excerpt_hindi,
      excerpt_english,
      featured_image_url,
      category,
      tags,
      status,
      meta_title,
      meta_description,
      meta_keywords
    } = req.body;

    // Validate required fields
    if (!title_hindi || !slug || !content_hindi) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if slug already exists
    const [existing] = await db.query('SELECT id FROM Blog_Posts WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const published_at = status === 'published' ? new Date() : null;

    const [result] = await db.query(`
      INSERT INTO Blog_Posts (
        title_hindi, title_english, slug, content_hindi, content_english,
        excerpt_hindi, excerpt_english, featured_image_url, author_id,
        category, tags, status, published_at, meta_title, meta_description, meta_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title_hindi, title_english, slug, content_hindi, content_english,
      excerpt_hindi, excerpt_english, featured_image_url, req.user.id,
      category, tags, status, published_at, meta_title, meta_description, meta_keywords
    ]);

    res.status(201).json({
      message: 'Blog post created successfully',
      postId: result.insertId
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update blog post (admin)
router.put('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title_hindi,
      title_english,
      slug,
      content_hindi,
      content_english,
      excerpt_hindi,
      excerpt_english,
      featured_image_url,
      category,
      tags,
      status,
      meta_title,
      meta_description,
      meta_keywords
    } = req.body;

    // Check if post exists
    const [existing] = await db.query('SELECT id, status FROM Blog_Posts WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // If changing to published and not published before, set published_at
    let published_at = null;
    if (status === 'published' && existing[0].status !== 'published') {
      published_at = new Date();
    }

    let query = `
      UPDATE Blog_Posts SET
        title_hindi = ?, title_english = ?, slug = ?,
        content_hindi = ?, content_english = ?,
        excerpt_hindi = ?, excerpt_english = ?,
        featured_image_url = ?, category = ?, tags = ?,
        status = ?, meta_title = ?, meta_description = ?, meta_keywords = ?
    `;

    const params = [
      title_hindi, title_english, slug,
      content_hindi, content_english,
      excerpt_hindi, excerpt_english,
      featured_image_url, category, tags,
      status, meta_title, meta_description, meta_keywords
    ];

    if (published_at) {
      query += ', published_at = ?';
      params.push(published_at);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    res.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete blog post (admin)
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM Blog_Posts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Create category (admin)
router.post('/admin/categories', authenticateAdmin, async (req, res) => {
  try {
    const { name_hindi, name_english, slug, description_hindi, description_english } = req.body;

    if (!name_hindi || !slug) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await db.query(`
      INSERT INTO Blog_Categories (name_hindi, name_english, slug, description_hindi, description_english)
      VALUES (?, ?, ?, ?, ?)
    `, [name_hindi, name_english, slug, description_hindi, description_english]);

    res.status(201).json({
      message: 'Category created successfully',
      categoryId: result.insertId
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

module.exports = router;
