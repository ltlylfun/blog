export const SITE = {
  website: "https://blog.ltlyl.fun/", // replace this with your deployed domain
  author: "ltlyl",
  profile: "",
  desc: "这是ltlyl的blog网站，主要分享代码，偶尔分享日常，游戏，动漫。",
  title: "ltlyl",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "编辑网页",
    url: "https://github.com/ltlylfun/blog/tree/main/",
  },
  dynamicOgImage: false,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
