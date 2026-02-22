const BACKEND_URL = "https://unspeakingly-overdogmatical-annita.ngrok-free.dev";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const venue = body?.venue;
    if (typeof venue !== "string" || !venue.trim()) {
      return Response.json(
        { error: "Missing or invalid 'venue' in request body" },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      },
      body: JSON.stringify({ venue: venue.trim() }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return Response.json(
        { error: data?.message ?? data?.error ?? `Backend returned ${res.status}` },
        { status: res.status }
      );
    }
    return Response.json(data);
  } catch (err) {
    console.error("[api/analyze]", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Proxy request failed" },
      { status: 500 }
    );
  }
}
