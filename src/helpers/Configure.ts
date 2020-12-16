function jsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return '';
  }
}

export function getConfigFromGistData(data: {
  files: {
    [filename: string]: {
      content: string;
      language: string;
    };
  };
}) {
  const files = data.files;
  const first = Object.keys(files)[0];
  const content = files[first].content;
  return jsonParse(content);
}
