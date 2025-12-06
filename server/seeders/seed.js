require('dotenv').config();

// Importing the connection file will initiate mongoose.connect
const connection = require('../config/connection');
const ToyBoxData = require('../models/toyBoxData');

const seedToyBoxData = [
  {
    occasion:process.env.TB4L_OCCASION || 'Christmas',
    numberOfBoys: process.env.SEED_NUMBER_BOYS || 3,
    numberOfGirls: process.env.SEED_NUMBER_GIRLS || 4,
    totalBearsForBox: process.env.SEED_TOTAL_BEARS_FOR_BOX || 13,
    campaignRun: process.env.SEED_CAMPAIGN_RUN || '2025-Fall',
    totalGifts: process.env.SEED_TOTAL_GIFTS || 105,
    lastDayForGifts: process.env.SEED_LAST_DAY_FOR_GIFTS || '12-19-2025',
    sendGiftsAddress: process.env.SEED_SEND_GIFT_ADDRESS ||  'Quartzion'
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
