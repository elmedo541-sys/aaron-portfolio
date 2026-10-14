export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Use POST.' }); }
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host || origin !== `https://${host}`) return res.status(403).json({error:'Please send your inquiry from this website.'});
  if (!String(req.headers['content-type'] || '').includes('application/json')) return res.status(415).json({error:'Use JSON.'});
  const b = req.body;
  if (!b || typeof b !== 'object' || Array.isArray(b)) return res.status(400).json({error:'Invalid inquiry.'});
  if (b.website) return res.status(400).json({error:'Unable to submit this inquiry.'});
  const limits = {name:100,email:254,subject:150,message:4000};
  for (const [key,max] of Object.entries(limits)) {
    if (typeof b[key] !== 'string' || !b[key].trim() || b[key].length > max) return res.status(400).json({error:`Please check your ${key}.`});
  }
  const {name,email,subject,message} = Object.fromEntries(Object.keys(limits).map(k=>[k,b[k].trim()]));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(email+subject+name)) return res.status(400).json({error:'Please check your contact details.'});
  if (!process.env.RESEND_API_KEY) return res.status(503).json({error:'Email sending is not configured yet. Please use the email link below.'});
  try {
    const result = await fetch('https://api.resend.com/emails', {
      method:'POST', signal:AbortSignal.timeout(10000),
      headers:{'Authorization':`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({from:process.env.INQUIRY_FROM || 'Portfolio <onboarding@resend.dev>',to:['elmedo541@gmail.com'],reply_to:email,subject:`Portfolio inquiry: ${subject}`,text:`Name: ${name}\nEmail: ${email}\n\n${message}`})
    });
    if (!result.ok) return res.status(502).json({error:'Your inquiry could not be sent. Please try again or email me directly.'});
    const data=await result.json();
    if (!data.id) return res.status(502).json({error:'Email confirmation was unavailable. Please email me directly.'});
    return res.status(200).json({ok:true});
  } catch { return res.status(502).json({error:'Email service is unavailable. Please try again or email me directly.'}); }
}
