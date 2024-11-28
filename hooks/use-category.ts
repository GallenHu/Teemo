export function useCategory() {
  const getCategories = () => {
    return fetch("/api/category").then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const createCategory = (name: string) => {
    const data = { name };
    return fetch("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  return {
    getCategories,
    createCategory,
  };
}
