const { getPool, sql } = require('../config/db');

const logActivity = async (userId, action, entityType = null, entityId = null, details = null) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('user_id', sql.Int, userId)
      .input('action', sql.NVarChar(100), action)
      .input('entity_type', sql.NVarChar(50), entityType)
      .input('entity_id', sql.Int, entityId)
      .input('details', sql.NVarChar(500), details)
      .query(`INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
              VALUES (@user_id, @action, @entity_type, @entity_id, @details)`);
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};

module.exports = { logActivity };
