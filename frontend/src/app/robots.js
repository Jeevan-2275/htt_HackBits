export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://feedspace.io';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/settings'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
