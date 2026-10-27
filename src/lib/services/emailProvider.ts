/**
 * Email Provider Service Interface & Adapters
 * Default Console Logger for dev, pluggable with Resend / SMTP for production
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  sendEmail(message: EmailMessage): Promise<{ success: boolean; id?: string; error?: string }>;
}

class ConsoleEmailProvider implements EmailProvider {
  async sendEmail(message: EmailMessage): Promise<{ success: boolean; id?: string }> {
    console.log(`\n================== [GLOWBOOK EMAIL DISPATCH] ==================`);
    console.log(`TO: ${message.to}`);
    console.log(`SUBJECT: ${message.subject}`);
    console.log(`BODY PREVIEW: ${message.text || message.html.replace(/<[^>]+>/g, '').slice(0, 150)}...`);
    console.log(`=================================================================\n`);
    return { success: true, id: `mock-${Date.now()}` };
  }
}

export const emailProvider: EmailProvider = new ConsoleEmailProvider();

export async function sendBookingConfirmationEmail(params: {
  customerName: string;
  customerEmail: string;
  salonName: string;
  serviceNames: string[];
  startsAt: string;
  totalLkr: number;
  reference: string;
  manageLink: string;
}) {
  return emailProvider.sendEmail({
    to: params.customerEmail,
    subject: `Booking Confirmed: ${params.salonName} [Ref: ${params.reference}]`,
    html: `
      <h2>Your appointment is confirmed!</h2>
      <p>Dear ${params.customerName},</p>
      <p>Thank you for booking with <strong>${params.salonName}</strong> through Glowbook.</p>
      <ul>
        <li><strong>Reference:</strong> ${params.reference}</li>
        <li><strong>Date & Time:</strong> ${params.startsAt}</li>
        <li><strong>Services:</strong> ${params.serviceNames.join(', ')}</li>
        <li><strong>Total:</strong> LKR ${params.totalLkr.toLocaleString()} (Pay at salon)</li>
      </ul>
      <p><a href="${params.manageLink}">Click here to view or manage your appointment</a></p>
    `,
  });
}
