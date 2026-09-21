import { revalidatePath } from 'next/cache';
import { getContent, sanitizeContent, saveContent } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await getContent());
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const content = sanitizeContent(body);
  if (!content) {
    return Response.json({ error: 'Invalid content: check icons, values and labels.' }, { status: 400 });
  }

  await saveContent(content);
  revalidatePath('/');
  return Response.json(content);
}
