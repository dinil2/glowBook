/**
 * Messaging Provider Service Interface
 * Generates WhatsApp click-to-chat links with pre-filled message templates
 * Pre-architected to support official WhatsApp Cloud API later.
 */

export interface WhatsAppTemplateData {
  customerName: string;
  salonName: string;
  dateTime: string;
  serviceNames: string[];
  reference: string;
  manageLink: string;
}

export function generateWhatsAppConfirmationUrl(
  phone: string,
  data: WhatsAppTemplateData
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const message = `Hi ${data.customerName}! ✨ Your appointment at *${data.salonName}* is confirmed for *${data.dateTime}*.\n\nServices: ${data.serviceNames.join(', ')}\nRef: ${data.reference}\n\nView or reschedule your booking here: ${data.manageLink}\n\nSee you soon! - Glowbook`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppReminderUrl(
  phone: string,
  data: WhatsAppTemplateData
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const message = `Friendly reminder from *${data.salonName}*! 🌸 Your appointment is coming up on *${data.dateTime}*.\n\nServices: ${data.serviceNames.join(', ')}\nRef: ${data.reference}\n\nNeed directions or changes? ${data.manageLink}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateBookingShareUrl(
  salonName: string,
  serviceNames: string[],
  dateTime: string,
  salonUrl: string
): string {
  const message = `I just booked ${serviceNames.join(', ')} at *${salonName}* on ${dateTime} via Glowbook! 💅 Check out their services and book here: ${salonUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
