import { connectDatabase } from '../config/database.js';
import { CrisisResource } from '../models/CrisisResource.js';

const crisisResources = [
  {
    title: 'National Suicide Prevention Lifeline',
    description: '24/7 free and confidential support for people in distress',
    phoneNumber: '988',
    websiteUrl: 'https://suicidepreventionlifeline.org',
    country: 'US'
  },
  {
    title: 'Crisis Text Line',
    description: 'Free 24/7 support via text message',
    phoneNumber: 'Text HOME to 741741',
    websiteUrl: 'https://crisistextline.org',
    country: 'US'
  },
  {
    title: 'SAMHSA National Helpline',
    description: 'Treatment referral and information service',
    phoneNumber: '1-800-662-4357',
    websiteUrl: 'https://samhsa.gov',
    country: 'US'
  },
  {
    title: 'International Association for Suicide Prevention',
    description: 'Global crisis resources and support',
    websiteUrl: 'https://iasp.info/resources/Crisis_Centres',
    country: 'Global'
  }
];

const seedCrisisResources = async () => {
  try {
    await connectDatabase();
    
    // Clear existing resources
    await CrisisResource.deleteMany({});
    
    // Insert new resources
    await CrisisResource.insertMany(crisisResources);
    
    console.log('✅ Crisis resources seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding crisis resources:', error);
    process.exit(1);
  }
};

seedCrisisResources();