import { fetchTracker, isDate } from '@/lib/campaignTracker';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const from = params.get('from');
  const to = params.get('to');

  if (!isDate(from) || !isDate(to) || from > to) {
    return Response.json({ error: 'Provide valid from and to dates (YYYY-MM-DD).' }, { status: 400 });
  }

  try {
    return Response.json(await fetchTracker(from, to));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Tracker unavailable';
    return Response.json({ error: message }, { status: 502 });
  }
}
