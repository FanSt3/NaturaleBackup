// Test SMTP Configuration Script
// Pokrenite: node scripts/test-smtp.js your-email@example.com

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Učitaj .env.local ako postoji
dotenv.config({ path: '.env.local' });

async function testSmtp() {
  // Uzimanje email-a iz komandne linije
  const testEmail = process.argv[2];
  
  if (!testEmail) {
    console.error('\x1b[31mGreška: Nedostaje email adresa za testiranje\x1b[0m');
    console.log('Korišćenje: node scripts/test-smtp.js your-email@example.com');
    process.exit(1);
  }
  
  // Provera da li su env varijable postavljene
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_PASSWORD;
  
  if (!gmailUser || !gmailPassword) {
    console.error('\x1b[31mGreška: GMAIL_USER i GMAIL_PASSWORD moraju biti postavljeni u .env.local fajlu\x1b[0m');
    console.log('\x1b[33mMolimo kreirajte .env.local fajl sa sledećim sadržajem:\x1b[0m');
    console.log(`
GMAIL_USER=your-gmail-account@gmail.com
GMAIL_PASSWORD=your-gmail-app-password
JWT_SECRET=some-secure-random-string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`);
    console.log('\x1b[33mNapomena: Za Gmail morate koristiti App Password, ne vašu regularnu lozinku.\x1b[0m');
    console.log('Kako generisati App Password: https://support.google.com/accounts/answer/185833');
    process.exit(1);
  }
  
  console.log('\x1b[36mTestiranje SMTP konfiguracije...\x1b[0m');
  
  // Kreiranje transporter-a
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  // Provera konekcije
  try {
    console.log('Provera SMTP konekcije...');
    await transporter.verify();
    console.log('\x1b[32mSMTP konfiguracija je ispravna!\x1b[0m');
    
    // Slanje test email-a
    console.log(`Slanje test email-a na ${testEmail}...`);
    
    const info = await transporter.sendMail({
      from: gmailUser,
      to: testEmail,
      subject: 'Test email - Naturale Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #10b981;">Test email - Naturale Admin</h2>
          <p>Poštovani,</p>
          <p>Ovo je test email za proveru SMTP konfiguracije.</p>
          <p>Ako možete pročitati ovu poruku, to znači da je vaša SMTP konfiguracija ispravna!</p>
          <p>Srdačan pozdrav,<br/>Naturale Tim</p>
        </div>
      `,
    });
    
    console.log('\x1b[32mTest email uspešno poslat!\x1b[0m');
    console.log(`ID poruke: ${info.messageId}`);
    console.log(`Primljen od strane: ${info.accepted.join(', ')}`);
    
  } catch (error) {
    console.error('\x1b[31mGreška pri SMTP konfiguraciji:\x1b[0m', error);
    console.log('\x1b[33mProvera za česte probleme:\x1b[0m');
    console.log('1. Da li ste uneli ispravan GMAIL_USER u .env.local fajlu?');
    console.log('2. Da li ste generisali i koristite App Password za Gmail?');
    console.log('3. Da li ste omogućili "Less secure app access" za vaš Gmail nalog?');
    console.log('Kako omogućiti pristup manje bezbednim aplikacijama: https://myaccount.google.com/lesssecureapps');
    console.log('Kako generisati App Password: https://support.google.com/accounts/answer/185833');
  }
}

testSmtp().catch(console.error); 