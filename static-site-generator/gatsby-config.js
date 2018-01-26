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
    }
  ]
}
 