import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `ankeeDesk | Creative Marketing Agency`,
    description: `ankeeDesk is a bold creative marketing agency that turns ideas into impact. Strategy, branding, digital marketing, and design — all crafted with passion.`,
    siteUrl: `https://www.ankeedesk.com`,
    author: `@ankeedesk`,
    keywords: `marketing agency, creative agency, branding, digital marketing, strategy, design, ankeeDesk`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `fonts`,
        path: `${__dirname}/src/fonts`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ankeeDesk - Creative Marketing Agency`,
        short_name: `ankeeDesk`,
        start_url: `/`,
        background_color: `#FDFF97`,
        theme_color: `#FDFF97`,
        display: `standalone`,
        icon: `src/images/icon.png`,
      },
    },
    `gatsby-plugin-sitemap`,
  ],
}

export default config
