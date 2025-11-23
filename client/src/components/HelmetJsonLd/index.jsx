import React from 'react';
import { Helmet } from 'react-helmet';
import slugify from 'slugify';
import blogs from '../../utils/blogData';
import services from '../../utils/servicesData';
import { getReviewsForService } from '../../utils/reviewUtils';

const baseUrl = import.meta.env.VITE_BASE_URL;
const qtsPhoneNumber = import.meta.env.VITE_QTS_PHONE;

const nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);

export default function HelmetJsonLd() {

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "name": "Quartzion.com",
                "url": baseUrl,
                "publisher": {
                    "@id": "https://yourdomain.com/#organization"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${baseUrl}/?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "@id": `${baseUrl}/#organization`,
                "name": "Quartzion Technology Solutions Corp.",
                "url": `${baseUrl}`,
                "logo": {
                    "@type": "ImageObject",
                    "url": `${baseUrl}/qts-icon-2.webp`
                },
                "sameAs": [
                    "https://www.linkedin.com/company/quartzion-technology-solutions-corp",
                    "https://twitter.com/QuartzionTech"
                ]
            },
            {
                "@type": "LocalBusiness",
                "priceRange": "$",
                "@id": `${baseUrl}/#localbusiness`,
                "name": "Quartzion Technology Solutions Corp.",
                "image": {
                    "@type": "ImageObject",
                    "url": `${baseUrl}/qts-icon-2.webp`
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "690 Main St 253",
                    "addressLocality": "Safety Harbor",
                    "addressRegion": "FL",
                    "postalCode": "34695",
                    "addressCountry": "US"
                },
                "telephone": `${qtsPhoneNumber}`,
                "url": `${baseUrl}`,
                "parentOrganization": {
                    "@id": `${baseUrl}/#organization`
                }
            },
            ...blogs.map(blog => ({
                "@type": "BlogPosting",
                "headline": blog.title,
                "name": blog.title,
                "description": blog.description || blog.content.slice(0, 160),
                "author": {
                    "@type": "Person",
                    "name": "Peter Smith",
                    "url": `${baseUrl}/#peter-smith`,
                    "image": `${baseUrl}/pete-ceo-2.webp`
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Quartzion Technology Solutions Corp.",
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${baseUrl}/qts-icon-2.webp`
                    }
                },
                "articleSection": "Technology",
                "articleBody": blog.content.replace(/[\u2028\u2029]/g, ""),
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `${baseUrl}/blogs?slug=${slugify(blog.title, { lower: true, strict: true })}`
                },
                "inLanguage": "en-US",
                "keywords": "technology, nonprofit, innovation, Quartzion, community, development, 501c3",
                "datePublished": blog.date || "2025-07-01T14:00:00-04:00",
                "url": `${baseUrl}/blogs?slug=${slugify(blog.title, { lower: true, strict: true })}`,
                "image": `${baseUrl}${blog.img.replace(/^\./, '')}`,
                "wordCount": blog.content.split(/\s+/).length
            })),

            ...services.map(service => ({
                "@type": ["Service", "Product"],
                "@id": `${baseUrl}/services?slug=${slugify(service.title, { lower: true, strict: true })}`,
                "name": service.title,
                "image": `${baseUrl}${service.img.replace(/^\./, '')}`,
                "description": service.description || service.content.slice(0, 160),
                "offers": {
                    "@type": "AggregateOffer",
                    "url": `${baseUrl}/services?slug=${slugify(service.title, { lower: true, strict: true })}`,
                    "priceCurrency": "USD",
                    "lowPrice": "50",
                    "highPrice": "1000",
                    "applicableCountry": "US",
                    "offerCount": "9",
                    "priceValidUntil": nextYear.toISOString().split('T')[0],
                    "brand": {
                        "@type": "Organization",
                        "@id": `${baseUrl}/#organization`,
                        "name": "Quartzion Technology Solutions Corp."
                    },
                    "hasMerchantReturnPolicy": {
                        "@type": "MerchantReturnPolicy",
                        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
                    },
                    "shippingDetails": {
                        "@type": "OfferShippingDetails",
                        "shippingRate": {
                            "@type": "MonetaryAmount",
                            "value": "0.00",
                            "currency": "USD",
                            "addressCountry": "US"
                        },
                        "shippingDestination": {
                            "@type": "DefinedRegion",
                            "name": "US"
                        },
                        "deliveryTime": {
                            "@type": "ShippingDeliveryTime",
                            "handlingTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 0,
                                "maxValue": 0,
                                "unitCode": "d"
                            },
                            "transitTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 0,
                                "maxValue": 0,
                                "unitCode": "d"
                            }
                        },
                    },
                    "availability": "https://schema.org/InStock",
                    "handlingTime": "0d", 

                },
                "review": getReviewsForService(service.title)
            }))
        ],
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

