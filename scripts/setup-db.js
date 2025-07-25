// Database setup script for SELAH
const { sql } = require('@vercel/postgres');

async function setupDatabase() {
  try {
    console.log('🧘 Setting up SELAH database...');
    
    // Create emails table
    await sql`
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        source VARCHAR(50) DEFAULT 'landing-page',
        engagement_data JSONB
      );
    `;
    
    // Create analytics table
    await sql`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        time_spent INTEGER,
        max_scroll INTEGER,
        breath_interactions INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    console.log('✅ Database setup complete');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

setupDatabase();
