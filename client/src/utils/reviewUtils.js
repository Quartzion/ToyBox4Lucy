// Map service titles to review quotes
const serviceReviews = {
    "Technical Analysis": [
        {
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": "Christopher J. Calo",
            },
            "datePublished": "2020-12-17",
            "reviewBody": "In everything that he does, Pete has a Privacy-and-Security-First mentality... His advocacy for privacy engenders the same feelings amongst others."
        }
    ],
    "Troubleshooting Session": [
        {
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": "Bill Eastman"
            },
            "datePublished": "2022-06-24",
            "reviewBody": "Peter is always willing to jump into the deep end and help out in a pinch. He and Mark McClung hammered out the details efficiently."
        }
    ],
    "Solution Development": [
        {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Britton Karon" },
            "datePublished": "2022-06-24",
            "reviewBody": "Peter took time to understand the big picture around why we were making changes and took ownership of refining outdated requirements."
        }
    ],
    "Technology Upgrade": [
        {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Britton Karon" },
            "datePublished": "2022-06-24",
            "reviewBody": "Peter communicated and collaborated, setting up calls to keep the story moving along during system upgrades and modernization."
        }
    ],
    "Technical Audits / Health Checks": [
        {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Joe Funair" },
            "datePublished": "2022-06-15",
            "reviewBody": "Peter has been an excellent, responsive resource, helping review systems and liaising between client, implementation, and development."
        }
    ],
    "Performance & Accessibility": [
        {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Alan Samet" },
            "datePublished": "2022-03-14",
            "reviewBody": "Peter found an error in the logic that performs the inversion, validating complex logic in a way no one else could replicate."
        }
    ],
    "Strategic Tech Planning Sessions": [
        {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Andrew Gorgen" },
            "datePublished": "2022-06-15",
            "reviewBody": "Peter provides guidance freely, strategizes approaches, and saves time by offering invaluable feedback in planning sessions."
        }
    ],
    "Data Intake Setup & Optimization": [
        {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Joe Funair" },
            "datePublished": "2022-06-15",
            "reviewBody": "Peter suggested improvements that helped clients and explained operability in simple, effective terms during form and intake setup."
        }
    ],
    "Internal Tech Skills Workshops": [
        {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Rob Server" },
            "datePublished": "2022-02-17",
            "reviewBody": "Peter stepped into a challenging role and succeeded with authenticity, honesty, and persistence, empowering teams through skill-building."
        }
    ]
};

// Export a helper function
export function getReviewsForService(serviceTitle) {
    return serviceReviews[serviceTitle] || [];
}
