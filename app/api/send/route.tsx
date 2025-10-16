import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';

// Add this line to force dynamic rendering
export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    console.log('API Key exists:', !!process.env.RESEND_API_KEY);

    const body = await req.json();
    console.log('Request body:', body);

    const { applicantName, applicantEmail, jobTitle, companyName } = body;

    // Validate email
    if (!applicantEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantEmail)) {
      console.error('Invalid email:', applicantEmail);
      return Response.json({ error: 'Invalid email address' }, { status: 422 });
    }

    // Validate required fields
    if (!applicantName || !jobTitle || !companyName) {
      console.error('Missing fields:', { applicantName, jobTitle, companyName });
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Attempting to send email to:', applicantEmail);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'JobSeeker <onboarding@resend.dev>',           // only verified domains entered here
      to: ['akshitsahore2827@gmail.com'],                 // email of the user that owns api key, get one from  https://resend.com/api-keys
      subject: `Application Received for ${jobTitle} at ${companyName}`,
      react: EmailTemplate({
        firstName: applicantName,
        jobTitle: jobTitle,
        companyName: companyName
      }),
    });

    if (error) {
      console.error('Resend API error:', error);
      return Response.json({
        error: 'Failed to send email',
        details: error
      }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return Response.json({ success: true, data }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in email route:', error);
    return Response.json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}