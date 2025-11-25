const serviceTemplates = [
    {
        title: "Boy Gift",
        img: "./b-present.png",
        content: `This gift is for a boy ages 5 - 7 years`,
    },
    {
        title: "Girl Gift",
        img: "./g-present.png",
        content: `This gift is for a girl ages 5 - 7 years`,
    },
];

// Generate cards based on number of boys and girls
export function generateQtsServices(numberOfBoys, numberOfGirls) {
    const qtsServices = [];
    
    // Add boy gift cards
    for (let i = 0; i < numberOfBoys; i++) {
        qtsServices.push({
            ...serviceTemplates[0],
            id: `boy-${i}`
        });
    }
    
    // Add girl gift cards
    for (let i = 0; i < numberOfGirls; i++) {
        qtsServices.push({
            ...serviceTemplates[1],
            id: `girl-${i}`
        });
    }
    
    return qtsServices;
}

export default serviceTemplates;
