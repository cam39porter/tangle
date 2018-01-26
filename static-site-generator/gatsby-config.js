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
      }
    },
    'gatsby-transformer-remark'
  ]
}
 