import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, path }) {
  const url = `https://pdf-micro-saas.vercel.app${path}`;

  return (
    <Helmet>
      <title>{title} | PDF Studio</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}