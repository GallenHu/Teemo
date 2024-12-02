export interface ISiteItem {
  name: string;
  url: string;
  icon: string;
  order: number;
  category?: string;
}

export interface ICategory {
  name: string;
  order: number;
}
