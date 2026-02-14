// Email API endpoint - supports both real email sending and mock mode
import nodemailer from 'nodemailer';

// Initialize transporter based on environment variables
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export async function POST(request) {
  try {
    const { emails, campaignName, campaignLink } = await request.json();

    // Validate input
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid emails provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!campaignName || !campaignLink) {
      return new Response(
        JSON.stringify({ error: 'Campaign name and link are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email template
    const emailTemplate = (email, link, campaign) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .content { padding: 40px 30px; }
            .content h2 { color: #1f2937; margin-top: 0; }
            .content p { color: #6b7280; line-height: 1.6; margin: 15px 0; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; }
            .button:hover { transform: scale(1.05); }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
            .highlight { background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
            .link-box { background: #f3f4f6; padding: 15px; border-radius: 6px; word-break: break-all; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Feedspace</h1>
              <p>Share Your Video Testimonial</p>
            </div>
            
            <div class="content">
              <h2>Hi there! 👋</h2>
              <p>You've been invited to share your testimonial for <strong>${campaign}</strong>.</p>
              
              <div class="highlight">
                <strong>Share your story in just 2 minutes!</strong>
                <p>No editing, no scripts—just authentic feedback from you.</p>
              </div>
              
              <p>Click the button below to start recording your testimonial:</p>
              
              <div class="button-container">
                <a href="${link}" class="button">📹 Record My Testimonial</a>
              </div>
              
              <p>Or copy this link into your browser:</p>
              <div class="link-box">${link}</div>
              
              <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px;">
                Thanks for being part of our journey! 🚀
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 Feedspace. All rights reserved.</p>
              <p>This link will be active for 30 days.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // If transporter is available, send real emails
    if (transporter) {
      const results = await Promise.all(
        emails.map(email =>
          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `🎬 Share Your ${campaignName} Testimonial - 2 Minutes to Recording Gold`,
            html: emailTemplate(email, campaignLink, campaignName),
          })
        )
      );

      return new Response(
        JSON.stringify({
          success: true,
          message: `Emails sent to ${results.length} recipients`,
          count: results.length,
          mode: 'production',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Mock mode - simulate email sending
      console.log('📧 Mock Email Mode - Simulating email send');
      console.log('Recipient emails:', emails);
      console.log('Campaign:', campaignName);
      console.log('Recording link:', campaignLink);
      
      // Log email content for the first recipient
      if (emails.length > 0) {
        console.log('Email content:', emailTemplate(emails[0], campaignLink, campaignName));
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return new Response(
        JSON.stringify({
          success: true,
          message: `Mock: Simulated sending emails to ${emails.length} recipients`,
          count: emails.length,
          mode: 'mock',
          note: 'Set EMAIL_USER and EMAIL_PASSWORD in .env.local to send real emails',
          recipients: emails,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to send emails',
        details: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
