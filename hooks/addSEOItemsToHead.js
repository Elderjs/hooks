/**
 * How to Use:
 * 1. Add this hook into your hooks.js.
 * 2. Within each of your route.js files, use your data() function to return a data.seo object as show below.
 * 3. Update "YOUR SITE HERE" with your site name.
 
 ----------------------------
 *** Expected 'data' prop structure:
  const data = {
    seo: {
      title: 'title',
      metaDescription: 'metaDescription',
      bannerImage: {
        relative: '/relative/to/root/image.png',
      },
      jsonld: `<script type=application/ld+json>... your code here</script>`,
    },
  };
 ---------------------------- 

  */

const hooks = [
  {
    hook: 'stacks',
    name: 'addSEOItemsToHead',
    description:
      'Takes an SEO object and adds title, canonical, meta description, og tags, and jsonld if present. Adds errors if important fields are missing. ',
    priority: 99,
    run: ({ data, request, headStack, errors, settings }) => {
      if (!data.seo) {
        return {
          errors: [...errors, new Error(`Missing data.seo object on ${request.permalink}`)],
        };
      }

      const seoErrors = [];
      let str = '';
      if (data.seo.title) {
        str += `<title>${data.seo.title}</title>`;
        str += `<meta property="og:title" content="${data.seo.title}">`;
        str += `<meta property="twitter:title" content="${data.seo.title}">`;
      } else {
        seoErrors.push(new Error(`Missing data.seo.title on ${request.permalink}`));
      }

      if (settings.origin) {
        str += `<link rel="canonical" href="${settings.origin}${request.permalink}">`;
        str += `<meta property="og:url" content="${settings.origin}${request.permalink}">`;
      } else {
        seoErrors.push(new Error(`Missing origin in your elder.config.js. This will cause lots of SEO issues.`));
      }

      if (data.seo.metaDescription) {
        str += `<meta name="description" content="${data.seo.metaDescription}">`;
        str += `<meta property="og:description" content="${data.seo.metaDescription}">`;
        str += `<meta name="twitter:description" content="${data.seo.metaDescription}">`;
      } else {
        seoErrors.push(new Error(`Missing data.seo.metaDescription on ${request.permalink}`));
      }

      // Unique to Your site
      str += `<meta property="og:site_name" content="YOUR SITE HERE">`; // TODO!
      str += `<meta property="og:type" content="website" />`;
      str += `<meta property="og:locale" content="en_US" />`;
      str += `<meta name="twitter:card" content="summary_large_image">`;

      // expects bannerImage.relative to be a relative path
      if (data.seo.bannerImage && data.seo.bannerImage.relative) {
        str += `<meta property="og:image" content="${settings.origin}${data.seo.bannerImage.relative}">`;
        str += `<meta property="og:image:width" content="1200" />`;
        str += `<meta property="og:image:height" content="630" />`;
      }

      if (data.seo.jsonld && data.seo.jsonld.length > 0) {
        str += data.seo.jsonld;
      }

      return {
        headStack: [...headStack, { source: 'hooksjs', priority: 99, string: str }],
        errors: [...errors, ...seoErrors],
      };
    },
  },
];

module.exports = hooks;
