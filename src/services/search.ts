import fetchJsonp from "fetch-jsonp";

interface Response {
  p: boolean;
  q: string;
  s: string[];
}

export function getSuggestions(searchKey: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    fetchJsonp(`https://suggestion.baidu.com/su?wd=${searchKey}&ie=utf-8&p=3`, {
      jsonpCallback: "cb",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        resolve(json);
      })
      .catch((err: unknown) => {
        reject(err);
      });
  });
}
