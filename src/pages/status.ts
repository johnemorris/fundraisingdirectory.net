export function GET() {
  const {
    service,
    version,
    buildTime,
    statusCode,
    status,
    location,
  } = __BUILD_METADATA__;

  return new Response(
    `${JSON.stringify({ service, version, buildTime, statusCode, status, location }, null, 2)}\n`,
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
