import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query?.trim()) {
    return Response.json([]);
  }

  const res = await fetch(
    `https://suggestion.baidu.com/su?wd=${query}&ie=utf-8&p=3`,
    {
      headers: {
        "Content-Type": "text/javascript",
        referer: "https://www.baidu.com",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    }
  ).then((res) => res.text());
  // res: `window.baidu.sug({q:"holiday",p:false,s:["holiday","holiday什么意思","...","holiday怎么读","holiday前面用in还是on"]});`

  const handleString = res.replace("window.baidu.sug", "");
  const parseJson = (str: string) => {
    try {
      return new Function("return " + str)();
    } catch (err) {
      console.error("string parse error: ");
      console.error(str);
      console.error(`query: ${query}`);
      return { s: [] };
    }
  };

  const json = parseJson(handleString);

  const list: string[] = json.s || [];

  return Response.json(list.map((str, i) => ({ id: i, value: str })));
}
