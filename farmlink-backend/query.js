const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.ixezrmajxtgxsbrocqck:Gic26g05i4%21%21@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres' });
client.connect().then(async () => {
  try {
    const old_user_id = '196ba0ca-ed69-4ce9-a856-2afe21cadf87';
    await client.query("BEGIN");
    
    // orders
    await client.query(`DELETE FROM public.order_items WHERE order_id IN (SELECT id FROM public.orders WHERE consumer_id = $1)`, [old_user_id]);
    await client.query(`DELETE FROM public.orders WHERE consumer_id = $1`, [old_user_id]);

    // Check if farmer
    const farmer = await client.query("SELECT id FROM public.farmer_profiles WHERE user_id = $1", [old_user_id]);
    if (farmer.rows.length > 0) {
       const farmer_profile_id = farmer.rows[0].id;
       console.log("Deleting farmer dependencies for farmer profile ID: " + farmer_profile_id);
       
       // delete order_items referencing this farmer profile
       await client.query("DELETE FROM public.order_items WHERE farmer_id = $1", [farmer_profile_id]);
       // delete products
       await client.query("DELETE FROM public.products WHERE farmer_id = $1", [farmer_profile_id]);
       
       await client.query("DELETE FROM public.farmer_profiles WHERE user_id = $1", [old_user_id]);
    }

    await client.query(`DELETE FROM public.messages WHERE sender_id = $1 OR receiver_id = $1`, [old_user_id]);
    await client.query(`DELETE FROM public.reward_transactions WHERE consumer_id = $1`, [old_user_id]);
    
    await client.query(`DELETE FROM public.reviews WHERE consumer_id = $1`, [old_user_id]);
    // also reviews where farmer_id = farmer_profile_id
    if (farmer.rows.length > 0) {
        await client.query(`DELETE FROM public.reviews WHERE farmer_id = $1`, [farmer.rows[0].id]);
        await client.query(`DELETE FROM public.favorite_farms WHERE farmer_id = $1`, [farmer.rows[0].id]);
    }

    await client.query(`DELETE FROM public.knowledge_articles WHERE author_id = $1`, [old_user_id]);
    
    await client.query(`DELETE FROM public.cart_items WHERE cart_id IN (SELECT id FROM public.carts WHERE consumer_id = $1)`, [old_user_id]);
    await client.query(`DELETE FROM public.carts WHERE consumer_id = $1`, [old_user_id]);

    await client.query(`DELETE FROM public.favorite_farms WHERE consumer_id = $1`, [old_user_id]);
    await client.query(`DELETE FROM public.favorite_products WHERE consumer_id = $1`, [old_user_id]);

    await client.query(`DELETE FROM public.users WHERE id = $1`, [old_user_id]);
    console.log("Trigger deletion succeeded");
    await client.query("COMMIT");
  } catch (err) {
    console.error("Trigger deletion failed:", err.message);
    await client.query("ROLLBACK");
  } finally {
    client.end();
  }
}).catch(console.error);
