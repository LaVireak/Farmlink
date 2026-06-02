const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ixezrmajxtgxsbrocqck:gLp7%24_%2FwBFtr3%23g@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true' });

async function check() {
  await client.connect();
  try {
    const userRes = await client.query("SELECT id, email, role FROM users WHERE role = 'FARMER';");
    console.log('Farmers:');
    console.table(userRes.rows);

    const farmerProfileRes = await client.query('SELECT id, user_id, farm_name FROM farmer_profiles;');
    console.log('Farmer Profiles:');
    console.table(farmerProfileRes.rows);

    for (const farmer of farmerProfileRes.rows) {
      console.log(`Checking orders for profile: ${farmer.farm_name} (${farmer.id})`);
      const res = await client.query(`
        SELECT COUNT(DISTINCT o.id) as count
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE p.farmer_id = $1;
      `, [farmer.id]);
      console.log(`- Orders count: ${res.rows[0].count}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

check();
