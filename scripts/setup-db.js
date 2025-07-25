// scripts/setup-db.js - Enhanced Database setup for SELAH
const { sql } = require("@vercel/postgres");

async function setupDatabase() {
  try {
    console.log("🧘 Setting up SELAH database...");

    // Create emails table
    await sql`
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        source VARCHAR(50) DEFAULT 'landing-page',
        engagement_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ Emails table ready");

    // Create feedback table
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) DEFAULT 'feedback',
        name VARCHAR(255),
        email VARCHAR(255),
        subject VARCHAR(500),
        message TEXT NOT NULL,
        source VARCHAR(100) DEFAULT 'unknown',
        metadata JSONB,
        status VARCHAR(20) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ Feedback table ready");

    // Create analytics table
    await sql`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        time_spent INTEGER,
        max_scroll INTEGER,
        breath_interactions INTEGER,
        engagement_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ Analytics table ready");

    // Create admin sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ Admin sessions table ready");

    // Create indexes for performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at DESC);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_emails_source ON emails(source);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
    `;
    console.log("✅ Database indexes ready");

    // Get current counts
    const emailCount = await sql`SELECT COUNT(*) as count FROM emails`;
    const feedbackCount = await sql`SELECT COUNT(*) as count FROM feedback`;
    const analyticsCount = await sql`SELECT COUNT(*) as count FROM analytics`;

    console.log("");
    console.log("📊 Current Data Summary:");
    console.log(`   📧 Emails: ${emailCount.rows[0].count}`);
    console.log(`   💬 Feedback: ${feedbackCount.rows[0].count}`);
    console.log(`   📈 Analytics: ${analyticsCount.rows[0].count}`);
    console.log("");
    console.log("🎉 SELAH database setup complete");
    console.log("");
    console.log("Ready to collect real contemplative data!");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

// Add some sample data for testing (optional)
async function addSampleData() {
  try {
    console.log("🌱 Adding sample data for testing...");

    // Check if we already have data
    const emailCount = await sql`SELECT COUNT(*) as count FROM emails`;
    if (emailCount.rows[0].count > 0) {
      console.log("📝 Data already exists, skipping sample data");
      return;
    }

    // Add sample email
    await sql`
      INSERT INTO emails (email, source, engagement_data) 
      VALUES (
        'ahiya@example.com', 
        'landing-page',
        '{"userAgent": "test", "source": "landing-page", "timestamp": "2025-01-25T10:00:00Z"}'
      )
    `;

    // Add sample feedback
    await sql`
      INSERT INTO feedback (type, name, email, subject, message, source, status) 
      VALUES (
        'feedback', 
        'Test User', 
        'test@example.com',
        'Love the contemplative approach',
        'This is exactly what technology should be. When will it be available?',
        'landing-page',
        'new'
      )
    `;

    console.log("✅ Sample data added");
  } catch (error) {
    console.warn(
      "⚠️  Sample data creation failed (this is okay):",
      error.message
    );
  }
}

// Main execution
async function main() {
  await setupDatabase();

  // Optionally add sample data in development
  if (process.env.NODE_ENV === "development") {
    await addSampleData();
  }

  process.exit(0);
}

main();
