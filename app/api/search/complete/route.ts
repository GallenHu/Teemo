import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  const res = await fetch(
    `https://serpapi.com/search?engine=google_autocomplete&q=${query}&key=7b3eb8a77774aab2410cbdcf579105d428f4fce7b149bba29fa4f71c75cc94af`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  return Response.json(data);
}
