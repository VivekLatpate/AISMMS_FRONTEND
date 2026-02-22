const BACKEND_URL = "https://unspeakingly-overdogmatical-annita.ngrok-free.dev";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/data`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "1",
      },
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
    console.error("[api/data]", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Proxy request failed" },
      { status: 500 }
    );
  }
}
