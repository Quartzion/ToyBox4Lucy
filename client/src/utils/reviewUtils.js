// Map service titles to review quotes
const serviceReviews = {
    "REVIEW 1": [
        {
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": "",
            },
            "datePublished": "",
            "reviewBody": ""
        }
    ],
    "Review 2": [
        {
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": ""
            },
            "datePublished": "",
            "reviewBody": ""
        }
    ],
};

// Export a helper function
export function getReviewsForService(serviceTitle) {
    return serviceReviews[serviceTitle] || [];
}
