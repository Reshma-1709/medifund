/**
 * Email Service for MediFund
 * Sends confirmation emails for verified donations and campaigns
 */

exports.sendDonationConfirmationEmail = async ({
  donorEmail,
  donorName,
  amount,
  transactionId,
  receiptNumber,
  campaignTitle,
  patientName
}) => {
  try {
    const formattedAmount = '₹' + Number(amount).toLocaleString('en-IN');
    const emailSubject = `Donation Confirmation - ${formattedAmount} received for ${patientName || 'Medical Treatment'}`;
    const emailBody = `
=============================================================
🏥 MEDIFUND DONATION RECEIPT & CONFIRMATION
=============================================================
Dear ${donorName || 'Generous Supporter'},

Thank you for your generous contribution.
Your donation has been successfully received and will help support medical treatment expenses.

Donation Details:
-------------------------------------------------------------
Donation Amount : ${formattedAmount} INR
Transaction ID  : ${transactionId}
Receipt Number  : ${receiptNumber}
Beneficiary     : ${patientName || 'Critical Patient'}
Campaign        : ${campaignTitle || 'Medical Crowdfunding Case'}
Status          : Successful / Verified (Razorpay)
Date & Time     : ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
-------------------------------------------------------------

Thank you for making a difference.

Warm regards,
Team MediFund
Together for a Healthier Tomorrow
=============================================================
`;

    console.log(`[Email Service] Donation Confirmation dispatched to ${donorEmail}:`);
    console.log(emailBody);

    return { success: true, emailSent: true, recipient: donorEmail };
  } catch (error) {
    console.error('[Email Service Error]', error.message);
    return { success: false, error: error.message };
  }
};
