import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, fullName, company } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Twilio sandbox default

    // Clean the phone number (remove spaces, dashes)
    // and ensure it has a + prefix for WhatsApp
    let cleanPhone = phone.replace(/[^\d+]/g, '');
    if (!cleanPhone.startsWith('+')) {
      // Assuming India as default if missing country code, though this should ideally be handled on the frontend
      cleanPhone = `+91${cleanPhone.replace(/^0+/, '')}`;
    }

    const messageBody = `Hi ${fullName || 'there'},\n\nWe have successfully received your Enterprise Sales Inquiry for ${company || 'your company'}. Our team is reviewing your requirements and will reach out to you shortly.\n\nThank you for choosing ApexQuant!`;

    // Simulation Mode Check
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      console.log('\n=============================================');
      console.log('📱 SIMULATED WHATSAPP MESSAGE SENT');
      console.log('=============================================');
      console.log(`To: whatsapp:${cleanPhone}`);
      console.log(`From: ${TWILIO_WHATSAPP_NUMBER}`);
      console.log(`Message:\n${messageBody}`);
      console.log('=============================================');
      console.log('Add your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env.local to send real messages.');
      console.log('=============================================\n');

      return NextResponse.json({ success: true, simulated: true });
    }

    // Real Twilio API Call
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const encodedCredentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const formData = new URLSearchParams();
    formData.append('To', `whatsapp:${cleanPhone}`);
    formData.append('From', TWILIO_WHATSAPP_NUMBER);
    formData.append('Body', messageBody);

    const twilioResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error('Twilio Error:', data);
      return NextResponse.json({ error: data.message || 'Failed to send WhatsApp message' }, { status: twilioResponse.status });
    }

    return NextResponse.json({ success: true, messageSid: data.sid });

  } catch (error) {
    console.error('WhatsApp API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
