export interface Restaurant {
  slug: string;
  name: string;
  shortName: string;
  brandColor: string;
  websiteUrl: string;
  nutritionSourceUrl: string;
  categories: string[];
  lastUpdated: string;
  orderLinks: OrderLinks;
}

export interface OrderLinks {
  uberEats?: string;
  doorDash?: string;
}
