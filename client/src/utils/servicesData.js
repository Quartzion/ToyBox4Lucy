const serviceTemplates = [
    {
        title: "Boy Gift",
        img: "./bGift-2.webp",
        content: `This gift is for a boy ages 5 - 7 years`,
    },
    {
        title: "Girl Gift",
        img: "./gGift-2.webp",
        content: `This gift is for a girl ages 5 - 7 years`,
    },
];

// Generate cards with even distribution for better visual aesthetics
export function generateQtsServices(numberOfBoys, numberOfGirls) {
    const qtsServices = [];
    let boysAdded = 0;
    let girlsAdded = 0;
    const total = numberOfBoys + numberOfGirls;
    
    // Calculate ratio to distribute evenly
    const boyRatio = numberOfBoys / total;
    const girlRatio = numberOfGirls / total;
    
    // Alternate between boys and girls, but respect the ratio
    for (let i = 0; i < total; i++) {
        const expectedBoys = Math.round((i + 1) * boyRatio);
        const expectedGirls = Math.round((i + 1) * girlRatio);
        
        // Add a boy if we haven't reached the expected count yet
        if (boysAdded < expectedBoys && boysAdded < numberOfBoys) {
            qtsServices.push({
                ...serviceTemplates[0],
                id: `boy-${boysAdded}`
            });
            boysAdded++;
        }
        // Otherwise add a girl if available
        else if (girlsAdded < numberOfGirls) {
            qtsServices.push({
                ...serviceTemplates[1],
                id: `girl-${girlsAdded}`
            });
            girlsAdded++;
        }
        // If girls are exhausted, add remaining boys
        else if (boysAdded < numberOfBoys) {
            qtsServices.push({
                ...serviceTemplates[0],
                id: `boy-${boysAdded}`
            });
            boysAdded++;
        }
    }
    
    return qtsServices;
}

export default serviceTemplates;
