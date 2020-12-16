import axios from 'axios';

export function getConfig(gistId: string, ghToken?: string) {
  return axios
    .get(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `token ${ghToken}`,
      },
    })
    .then((res) => {
      if (res.status === 200 && res.data) {
        return res.data;
      } else {
        return null;
      }
    });
}
