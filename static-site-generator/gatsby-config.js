module.exports = {
  siteMetadata: {
    title: 'Hex Ventures',
  },
  pathPrefix: '/hex-ventures',
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: './blog',
        name: 'blog-pages'    
      },
    },
    {
      resolve: 'gatsby-transformer-remark'
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./static/favicon.png",
        injectHTML: true,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          twitter: false,
          yandex: false,
          windows: false
        }
      }
    }
  ]
}
 