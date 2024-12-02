import { ICategory } from "@/types";
import { pick } from "lodash-es";

export function useCategory() {
  const getCategories = () => {
    return fetch("/api/category").then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const getCategorySites = (categoryId: string) => {
    return fetch(`/api/category/${categoryId}/sites`).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const createCategory = (newCategory: ICategory) => {
    return fetch("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pick(newCategory, ["name", "order"])),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  const updateCategory = (id: string, newCategory: ICategory) => {
    return fetch("/api/category/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pick(newCategory, ["name", "order"])),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  return {
    getCategories,
    getCategorySites,
    createCategory,
    updateCategory,
  };
}
