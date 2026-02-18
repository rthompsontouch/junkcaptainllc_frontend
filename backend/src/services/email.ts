import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendQuoteNotification(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  imageCount?: number;
}): Promise<boolean> {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping email notification");
    return false;
  }

  const to = process.env.BUSINESS_OWNER_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!to || !from) {
    console.warn("RESEND_FROM_EMAIL or BUSINESS_OWNER_EMAIL not set - skipping email");
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `New Quote Request from ${data.name} - Junk Captain LLC`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
        <p><strong>Address:</strong> ${data.address}</p>
        ${data.message ? `<p><strong>Message:</strong><br/>${data.message}</p>` : ""}
        ${data.imageCount ? `<p><strong>Photos attached:</strong> ${data.imageCount}</p>` : ""}
        <hr/>
        <p><em>Submitted via Junk Captain LLC website</em></p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
}
