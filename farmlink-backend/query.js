const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ixezrmajxtgxsbrocqck:gLp7%24_%2FwBFtr3%23g@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true' });
client.connect().then(() => {
  client.query("SELECT id, name_en, thumbnail_url FROM products LIMIT 10;", (err, res) => {
    if (err) console.error(err);
    else console.table(res.rows);
    client.end();
  });
}).catch(console.error);
