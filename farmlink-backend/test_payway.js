const http = require('https');
const crypto = require('crypto');

function generatePayload(offsetHours) {
    const merchantId = 'ec475344';
    const apiKey = 'c79b05c366cb0f368e066c7b49bd37a988575230';
    
    // Test different time offsets
    const now = new Date(Date.now() + offsetHours * 3600 * 1000);
    const reqTime = 
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    const tranId = `FL${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
    const amount = '1.00';
    const lifetime = 15;
    
    const firstName = 'Farm';
    const lastName = 'Link';
    const email = 'info@farmlink.com';
    const phone = '012345678';
    const purchaseType = 'purchase';
    const paymentOption = 'abapay_khqr';
    const currency = 'USD';
    const imageTemplate = 'template3_color';
    
    const itemsList = [{ name: 'Order Payment', quantity: 1, price: amount }];
    const items = Buffer.from(JSON.stringify(itemsList)).toString('base64');
    
    const callbackUrlBase64 = '';
    const returnDeeplink = '';
    const customFields = '';
    const returnParams = '';
    const payout = '';

    const hashInput = 
      reqTime +
      merchantId +
      tranId +
      amount +
      items +
      firstName +
      lastName +
      email +
      phone +
      purchaseType +
      paymentOption +
      callbackUrlBase64 +
      returnDeeplink +
      currency +
      customFields +
      returnParams +
      payout +
      lifetime +
      imageTemplate;

    const hash = crypto.createHmac('sha512', apiKey).update(hashInput).digest('base64');

    return {
      req_time: reqTime,
      merchant_id: merchantId,
      tran_id: tranId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      amount,
      purchase_type: purchaseType,
      payment_option: paymentOption,
      items,
      currency,
      callback_url: callbackUrlBase64,
      return_deeplink: returnDeeplink,
      custom_fields: customFields,
      return_params: returnParams,
      payout,
      lifetime,
      qr_image_template: imageTemplate,
      hash,
    };
}

function testApi(offset) {
  const payload = generatePayload(offset);
  const req = http.request('https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/generate-qr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Offset ${offset}h ->`, JSON.parse(data).status.message);
    });
  });
  req.write(JSON.stringify(payload));
  req.end();
}

// test UTC, UTC+7, UTC-7
testApi(0);
testApi(7);
testApi(-7);
