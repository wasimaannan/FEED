require("dotenv").config();
const sql = require("mssql");

const config = {
  server:   process.env.DB_HOST,
  port:     Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: { encrypt: false, trustServerCertificate: true },
};

async function main() {
  try {
    console.log("Connecting to", config.server, "/ DB:", config.database, "...");
    const pool = await sql.connect(config);
    console.log("✅ Connected!\n");

    console.log("──────── TABLES (in", config.database, ") ────────");
    const tables = await pool.request().query(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    tables.recordset.forEach(r => console.log(" -", r.TABLE_NAME));

    console.log("\n──────── COLUMNS (per table) ────────");
    const cols = await pool.request().query(`
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      ORDER BY TABLE_NAME, ORDINAL_POSITION
    `);
    let lastTable = "";
    cols.recordset.forEach(r => {
      if (r.TABLE_NAME !== lastTable) {
        console.log(`\n  [${r.TABLE_NAME}]`);
        lastTable = r.TABLE_NAME;
      }
      console.log(`    ${r.COLUMN_NAME} (${r.DATA_TYPE})`);
    });

    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
