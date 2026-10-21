import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { validate as validateEmail } from "email-validator";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

let rateLimiter: Ratelimit | undefined;
let upstashUnavailable = false;
const memoryRateLimits = new Map<string, { count: number; resetAt: number }>();

function getRateLimiter() {
  if (!rateLimiter) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    rateLimiter = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, "1 h"),
      analytics: true,
      prefix: "@upstash/ratelimit/contact",
    });
  }

  return rateLimiter;
}

function memoryRateLimit(ip: string) {
  const now = Date.now();
  const entry = memoryRateLimits.get(ip);

  if (!entry || entry.resetAt <= now) {
    memoryRateLimits.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  entry.count += 1;
  return entry.count <= RATE_LIMIT_MAX;
}

async function checkRateLimit(ip: string) {
  if (!upstashUnavailable) {
    try {
      const { success } = await getRateLimiter().limit(ip);
      return success;
    } catch (error) {
      // A dead/unconfigured Redis instance must not take down the contact form.
      upstashUnavailable = true;
      console.error(
        "Upstash rate limiter unavailable; using in-memory fallback.",
        error,
      );
    }
  }

  return memoryRateLimit(ip);
}

const ALLOWED_ORIGINS = new Set([
  "https://atharvaajmera.github.io",
  "https://atharva.github.io",
  "https://atharva-portfolio-liart.vercel.app",
  "http://localhost:3000",
]);

function corsHeaders(origin: string | null) {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://atharvaajmera.github.io";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return NextResponse.json(body, { status, headers: corsHeaders(origin) });
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const allowed = await checkRateLimit(ip);

  if (!allowed) {
    return json(
      {
        error: "Too many messages! Please wait a while before sending another.",
      },
      429,
      origin,
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ message: "Invalid request body" }, 400, origin);
  }

  const { email, name, message, honeypot } = payload ?? {};

  if (honeypot) {
    return json({ message: "Freezed for bot behaviour." }, 400, origin);
  }

  if (!email || !name || !message) {
    return json({ message: "All fields are required" }, 400, origin);
  }

  // Email validation using email-validator library
  if (!validateEmail(email)) {
    return json({ message: "Invalid email address format" }, 400, origin);
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const clientMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #3b82f6; margin-bottom: 20px;">Thank You for Reaching Out!</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Thank you for your message! I've received your inquiry and will get back to you shortly.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 20px;">
              Best regards,<br>
              <strong>Atharva</strong>
            </p>
          </div>
        </div>
      `,
    };

    const adminMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.EMAIL_USERNAME,
      subject: `New Portfolio Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #3b82f6; margin-bottom: 20px;">New Contact Form Submission</h2>
            <div style="background-color: #f3f4f6; padding: 15px; margin: 15px 0; border-radius: 5px;">
              <p style="color: #666; font-size: 14px; margin: 0; font-weight: bold;">Name:</p>
              <p style="color: #333; font-size: 16px; margin: 5px 0 15px 0;">${name}</p>
              
              <p style="color: #666; font-size: 14px; margin: 0; font-weight: bold;">Email:</p>
              <p style="color: #333; font-size: 16px; margin: 5px 0 15px 0;">
                <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
              </p>
              
              <p style="color: #666; font-size: 14px; margin: 0; font-weight: bold;">Message:</p>
              <p style="color: #333; font-size: 16px; margin: 5px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Received at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    return json({ message: "Email sent successfully!" }, 200, origin);
  } catch (error) {
    console.error("Email error:", error);
    return json({ message: "Failed to send email" }, 500, origin);
  }
}
