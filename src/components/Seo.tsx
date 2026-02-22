import React from "react"
import { useStaticQuery, graphql } from "gatsby"

interface SeoProps {
  title?: string
  description?: string
  pathname?: string
  children?: React.ReactNode
}

const Seo: React.FC<SeoProps> = ({ title, description, pathname, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
          author
          keywords
        }
      }
    }
  `)

  const meta = data.site.siteMetadata
  const seoTitle = title ? `${title} | ${meta.title}` : meta.title
  const seoDescription = description || meta.description
  const seoUrl = `${meta.siteUrl}${pathname || ""}`

  return (
    <>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={meta.keywords} />
      <meta name="author" content={meta.author} />

      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ankeeDesk" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:creator" content={meta.author} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MarketingAgency",
          name: "ankeeDesk",
          url: meta.siteUrl,
          description: seoDescription,
          foundingDate: "2024",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "hello@ankeedesk.com",
          },
          sameAs: [
            "https://twitter.com/ankeedesk",
            "https://instagram.com/ankeedesk",
            "https://linkedin.com/company/ankeedesk",
          ],
        })}
      </script>

      <meta name="theme-color" content="#FDFF97" />
      <link rel="canonical" href={seoUrl} />

      {children}
    </>
  )
}

export default Seo
