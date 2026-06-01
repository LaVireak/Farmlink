const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ixezrmajxtgxsbrocqck:gLp7%24_%2FwBFtr3%23g@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true' });
client.connect().then(() => {
  client.query("SELECT id, email, email_confirmed_at, banned_until FROM auth.users WHERE email IN ('lavireak99@gmail.com', 'testingai464@gmail.com');", (err, res) => {
    if (err) console.error(err);
    else console.table(res.rows);
    client.end();
  });
}).catch(console.error);
