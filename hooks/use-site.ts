export function useSite() {
  const getSites = () => {
    return fetch("/api/site").then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const getSitesWithCategory = () => {
    return fetch("/api/site?category=1").then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  return {
    getSites,
    getSitesWithCategory,
  };
}
