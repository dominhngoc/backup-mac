/** @type {import('next-sitemap').IConfig} */

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN
const UserAgent = []
const config = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/admin/', '/search', '/redirect', '/product'],
      },
      ...UserAgent.map((agent) => {
        return {
          userAgent: agent,
          disallow: '/',
        }
      }),
    ],
    additionalSitemaps: [
      `${siteUrl}/sitemap.xml`,
      // `${siteUrl}/sitemaps/post.xml`,
      // `${siteUrl}/sitemaps/page.xml`,
      // `${siteUrl}/sitemaps/review.xml`,
    ],
  },
}
module.exports = config
