import { fetchAnalytics, isDate } from '@/lib/campaignTracker';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const from = params.get('from');
  const to = params.get('to');

  if (!isDate(from) || !isDate(to) || from > to) {
    return Response.json({ error: 'Provide valid from and to dates (YYYY-MM-DD).' }, { status: 400 });
  }

  try {
    return Response.json(await fetchAnalytics(from, to));
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Tracker unavailable' }, { status: 502 });
  }
}
