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
  imageUrls?: string[];
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
        ${data.imageUrls?.length ? data.imageUrls.map((url, i) => `<p><a href="${url}">View photo ${i + 1}</a></p>`).join("") : ""}
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

/** Sends a thank-you confirmation to the customer who submitted the quote form */
export async function sendQuoteConfirmationToCustomer(data: {
  name: string;
  email: string;
}): Promise<boolean> {
  if (!resend) {
    console.warn("RESEND_API_KEY not set - skipping confirmation email");
    return false;
  }

  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    console.warn("RESEND_FROM_EMAIL not set - skipping confirmation email");
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to: data.email,
      subject: "Thank you for your quote request - Junk Captain LLC",
      html: `
        <h2>Thank you for reaching out, ${data.name}!</h2>
        <p>We've received your junk removal quote request and will be in touch shortly.</p>
        <p>Our team typically responds within 24 hours. If you have any urgent questions, feel free to call us at <a href="tel:+19108081125">(910) 808-1125</a>.</p>
        <p>We look forward to helping you with your junk removal needs!</p>
        <hr/>
        <p><em>Junk Captain LLC</em><br/>
        Serving Raleigh, Cary, Apex, Fuquay Varina & Durham</p>
      `,
    });

    if (error) {
      console.error("Resend confirmation error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Confirmation email send error:", err);
    return false;
  }
}
