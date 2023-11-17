export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "Web3 Starter",
  description: "Web3 Starter",
  url: "http://localhost:3000",
  ogImage: "http://localhost:3000/og.jpg",
  links: {
    twitter: "",
  },
};
