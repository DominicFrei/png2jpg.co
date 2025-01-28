# SEO Case Study - png2jpg.co

## What is this repo about?

This project is a case study born out of https://x.com/dominicfrei/status/1821751530309218656 as a #LearnSeoInPublic opportunity.

The repo documents each and every step I have taken to improve the SEO of https://png2jpg.co/ (source code also in this repo).

The goal: rank against the biggest competitor https://png2jpg.com/ and learn how to get more clicks.

## Setup / Involved technologies

Some of these are not relevant to SEO but I want to show everything as transparant as possible.

- Domain: AWS Route 53 (forwarding via a CNAME DNS entry to Vercel)
- Hosting: Vercel
- Deployment: automatically via Vercel GitHub actions from this repo.

## Steps I've taken so far (knowingly).

### Anything directly related to code (html, css, js)

- Added a meta tag `description` to the `index.html`'s `header` section.
- Added a `title` tag to the `index.html`'s `header` section.
- Added some copy to the `index.html` describing what PNGs and JPGs are and talk about converting to have more findable keywords on the website.

### Anything not directly related to code but part of the deployment (robots.txt, sitemap.xml, etc.)

- Added a `robots.txt`: This doesn't have a direct effect on SEO but rather an indirect effect by focusing the crawling onto the important pages for bigger websites.
- Added a `sitemap.xml`: It tells the crawler about which pages exist on your website to make sure everything is covered.
  - [What is it?](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
  - [Build and submit a sitemap.xml](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

### Anything that's not part of the repo (Google Search Console, etc.)

- Submitted the URL to Google Search Console:
  - Go to https://search.google.com/search-console.
  - Click on `Add property`.
  - Add your URL.

## Next steps / Known issues / ideas

- [Not all pages indexed](https://github.com/DominicFrei/seo-case-study-png2jpg/issues/1)
- [sitemap.xml couldn't be fetched](https://github.com/DominicFrei/seo-case-study-png2jpg/issues/2) 
