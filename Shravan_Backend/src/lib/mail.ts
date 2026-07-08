import nodemailer from "nodemailer";

type EnquiryNotificationInput = {
  categoryId?: string | null;
  company?: string | null;
  customerName: string;
  email?: string | null;
  message: string;
  mobile: string;
  productId?: string | null;
  subject?: string | null;
};

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function readFirstEnv(names: string[]) {
  for (const name of names) {
    const value = readEnv(name);
    if (value) return value;
  }

  return "";
}

function getMailConfig() {
  const user = readFirstEnv(["SMTP_USER", "MAIL_USER", "GMAIL_USER"]);
  const pass = readFirstEnv(["SMTP_PASS", "MAIL_PASS", "GMAIL_APP_PASSWORD", "GMAIL_PASS"]);
  const explicitHost = readFirstEnv(["SMTP_HOST", "MAIL_HOST"]);
  const explicitService = readFirstEnv(["SMTP_SERVICE", "MAIL_SERVICE"]);
  const to = readFirstEnv(["ENQUIRY_NOTIFICATION_EMAIL", "MAIL_TO"]) || "shravanenterprises1312@gmail.com";
  const from = readFirstEnv(["SMTP_FROM", "MAIL_FROM"]) || user || to;

  let host = explicitHost;
  let service = explicitService;
  let port = Number(readFirstEnv(["SMTP_PORT", "MAIL_PORT"]) || "587");
  let secure = readFirstEnv(["SMTP_SECURE", "MAIL_SECURE"]) === "true" || port === 465;

  if (!host && !service && /@gmail\.com$/i.test(user)) {
    service = "gmail";
    host = "smtp.gmail.com";
    port = 465;
    secure = true;
  }

  if (!user || !pass || !from || !to || (!host && !service) || Number.isNaN(port)) {
    return null;
  }

  return { host, port, user, pass, secure, from, to, service };
}

function toHtmlLines(lines: Array<string | null | undefined>) {
  return lines
    .filter(Boolean)
    .map((line) => String(line).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))
    .join("<br />");
}

export async function sendEnquiryNotificationEmail(input: EnquiryNotificationInput) {
  const config = getMailConfig();
  if (!config) return false;

  const transporter = nodemailer.createTransport({
    service: config.service || undefined,
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const subject = input.subject?.trim() || `New enquiry from ${input.customerName}`;
  const lines = [
    `Name: ${input.customerName}`,
    input.company ? `Company: ${input.company}` : null,
    `Mobile: ${input.mobile}`,
    input.email ? `Email: ${input.email}` : null,
    input.productId ? `Product ID: ${input.productId}` : null,
    input.categoryId ? `Category ID: ${input.categoryId}` : null,
    "",
    "Message:",
    input.message,
  ];

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: input.email || undefined,
    subject,
    text: lines.filter(Boolean).join("\n"),
    html: toHtmlLines(lines),
  });

  return true;
}
