import axios from 'axios';

const ghToken = localStorage.getItem('ghtoken') || '';

export function getConfig(gistId: string) {
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
