import { NextRequest } from "next/server";

const TMDB_IMAGE_HOSTS = new Set(["image.tmdb.org", "www.themoviedb.org"]);
const ONE_DAY = 60 * 60 * 24;

function isAllowedTmdbPoster(url: URL) {
  return (
    url.protocol === "https:" &&
    TMDB_IMAGE_HOSTS.has(url.hostname) &&
    url.pathname.startsWith("/t/p/")
  );
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");

  if (!source) {
    return new Response("Missing TMDB image URL.", { status: 400 });
  }

  let tmdbUrl: URL;
  try {
    tmdbUrl = new URL(source);
  } catch {
    return new Response("Invalid TMDB image URL.", { status: 400 });
  }

  // Keep the proxy scoped to TMDB poster paths; it must not become a general
  // server-side fetch proxy.
  if (!isAllowedTmdbPoster(tmdbUrl)) {
    return new Response("Unsupported TMDB image URL.", { status: 400 });
  }

  try {
    const upstream = await fetch(tmdbUrl, {
      next: { revalidate: ONE_DAY },
    });

    if (!upstream.ok) {
      return new Response("Unable to fetch TMDB image.", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return new Response("TMDB response was not an image.", { status: 502 });
    }

    return new Response(await upstream.arrayBuffer(), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${ONE_DAY}, s-maxage=${ONE_DAY}`,
      },
    });
  } catch {
    return new Response("Unable to fetch TMDB image.", { status: 502 });
  }
}
