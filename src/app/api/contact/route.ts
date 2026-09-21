import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const FILE = path.join(process.cwd(), 'data', 'enquiries.json');
const MAX_STORED = 5000;

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  route: string;
  message: string;
  createdAt: string;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
  if (str(body.website, 100)) return Response.json({ ok: true });

  const name = str(body.name, 80);
  const phone = str(body.phone, 20);
  const email = str(body.email, 120);
  const route = str(body.route, 120);
  const message = str(body.message, 1000);

  if (name.length < 2) return Response.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!/^\+?[0-9\s-]{10,15}$/.test(phone)) return Response.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'Please enter a valid email.' }, { status: 400 });
  if (message.length < 5) return Response.json({ error: 'Please tell us a little about your shipment.' }, { status: 400 });

  const entry: Enquiry = { id: crypto.randomUUID(), name, phone, email, route, message, createdAt: new Date().toISOString() };

  try {
    let existing: Enquiry[] = [];
    try { existing = JSON.parse(await fs.readFile(FILE, 'utf8')); } catch { /* first enquiry */ }
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify([entry, ...existing].slice(0, MAX_STORED), null, 2), 'utf8');
  } catch {
    return Response.json({ error: 'Could not save your enquiry. Please use WhatsApp instead.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
