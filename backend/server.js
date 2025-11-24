require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'copilot_checklist',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all agencies with their progress
app.get('/api/agencies', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.name, 
        COUNT(CASE WHEN ap.completed = true THEN 1 END) as completed_items,
        COUNT(ci.id) as total_items
      FROM agencies a
      LEFT JOIN agency_progress ap ON a.id = ap.agency_id
      LEFT JOIN checklist_items ci ON ap.checklist_item_id = ci.id
      GROUP BY a.id, a.name
      ORDER BY a.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get checklist items
app.get('/api/checklist', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM checklist_items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create new agency
app.post('/api/agencies', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO agencies (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get agency with progress
app.get('/api/agencies/:id', async (req, res) => {
  try {
    const agencyResult = await pool.query('SELECT * FROM agencies WHERE id = $1', [req.params.id]);
    const progressResult = await pool.query(`
      SELECT ci.id, ci.item, ci.description, ap.completed, ap.agency_id
      FROM checklist_items ci
      LEFT JOIN agency_progress ap ON ci.id = ap.checklist_item_id AND ap.agency_id = $1
      ORDER BY ci.id
    `, [req.params.id]);
    
    res.json({
      agency: agencyResult.rows[0],
      progress: progressResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update checklist item progress for an agency
app.put('/api/agencies/:agencyId/progress/:itemId', async (req, res) => {
  const { completed } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO agency_progress (agency_id, checklist_item_id, completed)
      VALUES ($1, $2, $3)
      ON CONFLICT (agency_id, checklist_item_id) 
      DO UPDATE SET completed = $3
      RETURNING *
    `, [req.params.agencyId, req.params.itemId, completed]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
