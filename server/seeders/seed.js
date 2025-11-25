require('dotenv').config();

// Importing the connection file will initiate mongoose.connect
const connection = require('../config/connection');
const ToyBoxData = require('../models/toyBoxData');

const seedToyBoxData = [
  {
    totalKidsForCampaign: process.env.SEED_TOTAL_KIDS || '105',
    numberOfBoys: process.env.SEED_NUMBER_BOYS || '29',
    numberOfGirls: process.env.SEED_NUMBER_GIRLS || '7',
    campaignRun: process.env.SEED_CAMPAIGN_RUN || '2025-Fall'
  }
];

connection.once('open', async () => {
  try {
    console.log('Seeding ToyBoxData...');

    // Clear existing entries (optional)
    await ToyBoxData.deleteMany({});

    // Insert seed documents
    const inserted = await ToyBoxData.insertMany(seedToyBoxData);
    console.log(`Inserted ${inserted.length} ToyBoxData document(s).`);
  } catch (err) {
    console.error('Error seeding ToyBoxData:', err);
    process.exit(1);
  } finally {
    // Close the mongoose connection and exit
    connection.close(() => {
      console.log('Mongo connection closed. Exiting.');
      process.exit(0);
    });
  }
});
