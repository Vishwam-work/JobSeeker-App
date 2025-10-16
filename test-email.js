// Simple test script to test the email API
// Run this with: node test-email.js

const testEmail = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'application-confirmation',
        applicantEmail: 'test@example.com',
        applicantName: 'Test User',
        jobTitle: 'Software Engineer',
        companyName: 'Test Company',
        jobId: '123'
      })
    });

    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

testEmail();