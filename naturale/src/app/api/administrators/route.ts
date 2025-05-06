import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// GET /api/administrators
export async function GET(request: Request) {
  try {
    // Check if prisma client is initialized
    if (!prisma) {
      throw new Error("Database client not initialized");
    }

    const admins = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        firstLogin: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Error in /api/administrators:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

// POST /api/administrators
export async function POST(request: Request) {
  try {
    // Check if prisma client is initialized
    if (!prisma) {
      throw new Error("Database client not initialized");
    }

    const body = await request.json();
    const { name, email, password } = body;

    // Validacija email adrese - dodato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format", message: "Email adresa nije ispravnog formata" },
        { status: 400 }
      );
    }

    // Validacija lozinke - dodato
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password too short", message: "Lozinka mora imati najmanje 8 karaktera" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields", message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists", message: "Email address is already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Creating admin user with email: ${email}`);

    // Create new admin user
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        firstLogin: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        firstLogin: true,
      },
    });

    console.log(`Admin user created with ID: ${admin.id}`);

    // Provera SMTP konfiguracije
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      console.error('SMTP konfiguracija nije postavljena. Email neće biti poslat.');
      return NextResponse.json({ 
        admin, 
        warning: "SMTP nije konfigurisan, email obaveštenje nije poslato" 
      }, { status: 201 });
    }

    // Send email notification
    try {
      console.log(`Attempting to send welcome email to ${email}`);
      const emailSent = await sendWelcomeEmail(email, name, password);
      console.log(`Email sending result: ${emailSent ? 'Success' : 'Failed'}`);

      if (!emailSent) {
        return NextResponse.json({ 
          admin, 
          warning: "Korisnik je kreiran, ali email obaveštenje nije poslato" 
        }, { status: 201 });
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      return NextResponse.json({ 
        admin, 
        warning: "Korisnik je kreiran, ali došlo je do greške prilikom slanja email obaveštenja",
        emailError: emailError instanceof Error ? emailError.message : "Unknown email error"
      }, { status: 201 });
    }

    return NextResponse.json({ admin, emailSent: true }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/administrators:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email: string, name: string, password: string) {
  // Create transporter using detailed SMTP config for Gmail
  console.log('Setting up SMTP transporter...');
  
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // Allows self-signed certificates
      },
      debug: true // Dodato za debugging
    });

    console.log('Verifying connection to SMTP server...');
    await transporter.verify();
    console.log('SMTP server connection verified successfully');

    // Email content with improved styling
    const mailOptions = {
      from: `"Naturale Admin" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Pristupni podaci za Naturale Admin Panel',
      html: `
        <!DOCTYPE html>
        <html lang="sr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Dobrodošli u Naturale Admin Panel</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f7f7f7;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 30px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              max-width: 150px;
              margin-bottom: 20px;
            }
            h1 {
              color: #10b981;
              margin: 0 0 10px;
              font-size: 28px;
            }
            .content {
              margin-bottom: 30px;
            }
            .credentials {
              background-color: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
              border-left: 4px solid #10b981;
            }
            .credentials p {
              margin: 10px 0;
              font-size: 16px;
            }
            .important {
              background-color: #fff8e6;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
              border-left: 4px solid #f59e0b;
            }
            .btn {
              display: inline-block;
              background-color: #10b981;
              color: white;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
            }
            .btn:hover {
              background-color: #0d9668;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 14px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Dobrodošli u Naturale Admin Panel</h1>
            </div>
            
            <div class="content">
              <p>Poštovani/a <strong>${name}</strong>,</p>
              
              <p>Kreiran je vaš administratorski nalog za Naturale projekat. Ispod su vaši pristupni podaci:</p>
              
              <div class="credentials">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Inicijalna lozinka:</strong> ${password}</p>
              </div>
              
              <div class="important">
                <p><strong>Važno:</strong> Iz bezbednosnih razloga, nakon prve prijave bićete zatraženi da promenite inicijalnu lozinku.</p>
              </div>
              
              <p>Za pristup admin panelu, kliknite na dugme ispod:</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/login" class="btn">Naturale Admin Panel</a>
              </div>
              
              <p>Za sva pitanja možete odgovoriti na ovaj email.</p>
            </div>
            
            <div class="footer">
              <p>Srdačan pozdrav,<br/>Naturale Tim</p>
              <p>&copy; ${new Date().getFullYear()} Naturale. Sva prava zadržana.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log(`Sending email to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`, info.messageId);
    
    // Detaljnije informacije
    console.log('Email delivery info:', {
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      messageId: info.messageId
    });
    
    return true;
  } catch (error) {
    console.error('Error in sendWelcomeEmail function:', error);
    throw error;
  }
}

// Test SMTP endpoint - samo za testiranje, ukloniti u produkciji
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required for testing" }, 
        { status: 400 }
      );
    }
    
    const testResult = await sendWelcomeEmail(
      email, 
      "Test Korisnik", 
      "test_password123"
    );
    
    if (testResult) {
      return NextResponse.json({ 
        success: true, 
        message: "Test email sent successfully" 
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send test email" }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("SMTP test error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 