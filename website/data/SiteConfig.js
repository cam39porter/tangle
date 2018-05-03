module.exports = {
  blogPostDir: "posts", // The name of directory that contains your posts.
  siteTitle: "Tangle", // Site title.
  siteTitleAlt: "Tangle | Connect your thoughts", // Alternative site title for SEO.
  siteLogo: "/logos/logo-1024.png", // Logo used for SEO and manifest.
  siteUrl: "https://www.usetangle.com", // Domain of your website without pathPrefix.
  pathPrefix: "./", // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  siteDescription:
    "Tangle is the personal knowledge graph. Tangle empowers everyone to capture and connect thoughts to create big ideas.", // Website description used for RSS feeds/meta description tag.
  siteRss: "/rss.xml", // Path to the RSS file.
  siteFBAppID: "1825356251115265", // FB Application ID for using app insights
  googleAnalyticsID: "UA-47311644-5", // GA tracking ID.
  disqusShortname: "tangle-1", // Disqus shortname.
  postDefaultCategoryID: "Tangle", // Default category for posts.
  userName: "Tangle Community Member", // Username to display in the author segment.
  userTwitter: "", // Optionally renders "Follow Me" in the UserInfo segment.
  userLocation: "", // User location to display in the author segment.
  userAvatar: "", // User avatar to display in the author segment.
  userDescription: "", // User description to display in the author segment.
  // Links to social profiles/projects you want to display in the author segment/navigation bar.
  userLinks: [
    {
      label: "GitHub",
      url: "https://github.com/hex-ventures",
      iconClassName: "fa fa-github"
    },
    {
      label: "Twitter",
      url: "https://twitter.com/hexventures",
      iconClassName: "fa fa-twitter"
    },
    {
      label: "Email",
      url: "mailto:info@hex.ventures",
      iconClassName: "fa fa-envelope"
    }
  ],
  copyright: "Copyright © 2018. Hex Ventures", // Copyright string for the footer of the website and RSS feed.
  themeColor: "#ff9e37", // Used for setting manifest and progress theme colors.
  backgroundColor: "#111c77" // Used for setting manifest background color.
};
