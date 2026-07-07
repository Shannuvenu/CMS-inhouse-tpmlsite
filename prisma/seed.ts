import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Real bcrypt hashes replace the CHANGE_ME_HASH_X placeholders. These are
// DEV-ONLY passwords (also written to SEED_CREDENTIALS.md) so the 5 seeded
// accounts can log in locally. Change them before any real deployment.
const DEV_PASSWORDS: Record<string, string> = {
  'admin1@printersmysore.co.in': 'Admin1Pass!23',
  'admin2@printersmysore.co.in': 'Admin2Pass!23',
  'admin3@printersmysore.co.in': 'Editor3Pass!23',
  'admin4@printersmysore.co.in': 'Editor4Pass!23',
  'admin5@printersmysore.co.in': 'Editor5Pass!23',
};
const SALT_ROUNDS = 10;

async function main() {
  // ---- 1. Admin users (5 only, per brief) ----
  await prisma.user.createMany({
    data: [
      {
        email: 'admin1@printersmysore.co.in',
        passwordHash: bcrypt.hashSync(DEV_PASSWORDS['admin1@printersmysore.co.in'], SALT_ROUNDS),
        role: 'ADMIN',
      },
      {
        email: 'admin2@printersmysore.co.in',
        passwordHash: bcrypt.hashSync(DEV_PASSWORDS['admin2@printersmysore.co.in'], SALT_ROUNDS),
        role: 'ADMIN',
      },
      {
        email: 'admin3@printersmysore.co.in',
        passwordHash: bcrypt.hashSync(DEV_PASSWORDS['admin3@printersmysore.co.in'], SALT_ROUNDS),
        role: 'EDITOR',
      },
      {
        email: 'admin4@printersmysore.co.in',
        passwordHash: bcrypt.hashSync(DEV_PASSWORDS['admin4@printersmysore.co.in'], SALT_ROUNDS),
        role: 'EDITOR',
      },
      {
        email: 'admin5@printersmysore.co.in',
        passwordHash: bcrypt.hashSync(DEV_PASSWORDS['admin5@printersmysore.co.in'], SALT_ROUNDS),
        role: 'EDITOR',
      },
    ],
  });


  await prisma.teamCategory.createMany({
    data: [
      { name: 'Directors', slug: 'directors', sortOrder: 1 },
      { name: 'Executive Leadership', slug: 'executive-leadership', sortOrder: 2 },
      { name: 'Deccan Herald Editorial', slug: 'dh-editorial', sortOrder: 3 },
      { name: 'Prajavani Editorial', slug: 'prajavani-editorial', sortOrder: 4 },
    ],
  });


  await prisma.siteSetting.createMany({
    data: [
      { key: 'readers_in_print', value: '10,691,000' },
      { key: 'readers_in_print_note', value: 'Combined readership of Deccan Herald, Prajavani, Sudha & Mayura, per IRS 2019 Q2' },
      { key: 'pageviews_per_month', value: '90 million' },
      { key: 'pageviews_note', value: 'Deccan Herald and Prajavani combined, per Google Analytics report - December 2021' },
      { key: 'journalists', value: '383' },
      { key: 'contributors', value: '404' },
      { key: 'stories_published_per_day', value: '1200+' },
      { key: 'site_tagline', value: 'The Storytellers of Karnataka' },
      { key: 'site_founded', value: '1948' },
    ],
  });

  await prisma.brand.createMany({
    data: [
      {
        name: 'Deccan Herald',
        type: 'English Newspaper',
        website: 'http://www.deccanherald.com/',
        description: "Karnataka's compass in navigating contemporary times, considered the authentic voice of the community.",
        supplements: ['Metrolife', 'Spectrum', 'DH on Sunday / DH on Saturday'],
      },
      {
        name: 'Prajavani',
        type: 'Kannada Newspaper',
        website: 'http://www.prajavani.net/',
        tagline: 'The most trustworthy Kannada newspaper',
        description: 'Widely regarded as the most trusted and credible news brand across Karnataka.',
        supplements: ['Bhanuvarada Puravani', 'Bhoomika', 'Cine Puravani', 'Shikshana', 'Kshema-Kushala', 'Tantrajnana', 'Spardhavani'],
      },
      {
        name: 'Sudha',
        type: 'Kannada Weekly Magazine',
        website: 'http://sudhaezine.com/',
        launched: 'January 11, 1965',
        description: 'Comprehensive Kannada lifestyle weekly with over 2,700 issues published.',
        supplements: [],
      },
      {
        name: 'Mayura',
        type: 'Kannada Literary Monthly Magazine',
        website: 'http://mayuraezine.com/',
        launched: '1968',
        description: 'Leading Kannada literary monthly featuring detective, scientific, and secular stories.',
        supplements: [],
      },
    ],
  });

  // ---- 6. Testimonials (readers) ----
  await prisma.testimonial.createMany({
    data: [
      { quoteSummary: 'Long-time Deccan Herald reader, closer association with Prajavani via fortnightly column.', name: 'Ramachandra Guha', title: 'Author and Historian', category: 'reader' },
      { quoteSummary: 'Loves Deccan Herald, calls it the best newspaper with special supplements.', name: 'Shoba Narayan', title: 'Writer', category: 'reader' },
      { quoteSummary: "Praises Prajavani's balanced approach and avoidance of sensationalism.", name: 'Ramesh Arvind', title: 'Actor, Director', category: 'reader' },
      { quoteSummary: 'Praises simplified Science and Technology articles.', name: 'Prof. B N Suresh', title: 'Space Scientist', category: 'reader' },
      { quoteSummary: 'Calls Prajavani the best Kannada paper for objective, trustworthy reporting.', name: 'M P Ganesh', title: 'Former Olympic Hockey player', category: 'reader' },
      { quoteSummary: "Praises Prajavani's language and social awareness, and its legacy with the literary renaissance movement.", name: 'H S Venkateshamurthy', title: 'Poet', category: 'reader' },
      { quoteSummary: 'Credits Mayura with connecting him to readers from all walks of life through letters and calls.', name: 'Rahamat Tarikere', title: 'Critic', category: 'reader' },
      { quoteSummary: 'Praises Prajavani for objective reporting without sensationalizing news.', name: 'M S Ashadevi', title: 'Critic', category: 'reader' },
      { quoteSummary: 'First Kannada novel serialised in Sudha in 1973; still writes for Sudha.', name: 'K T Gatti', title: 'Novelist', category: 'reader' },
      { quoteSummary: 'Regular DH reader; praises contemporary coverage of nation, Karnataka, and Bengaluru.', name: 'Prof. M S Thimmappa', title: 'Former Vice Chancellor', category: 'reader' },
    ],
  });

  // ---- 7. Testimonials (advertisers) ----
  await prisma.testimonial.createMany({
    data: [
      { quoteSummary: 'DH & Prajavani have always been an inevitable part of our every campaign in Karnataka.', name: 'Asher O', title: 'MD - India Operations, Malabar Gold & Diamonds', category: 'advertiser' },
      { quoteSummary: 'DH & Prajavani, the backbone of all our campaigns.', name: 'Uzma Irfan', title: 'Director-Corporate Communication, Prestige Group', category: 'advertiser' },
      { quoteSummary: 'DH & Prajavani integral to Bajaj Auto media plans, cost effective and reach relevant audiences.', name: 'Nitin Kochar', title: 'Head of Media & PR, Bajaj Auto', category: 'advertiser' },
      { quoteSummary: 'DH is a tried and tested brand, integral to reaching discerning audience.', name: 'Mathew Abraham', title: 'Head-Corporate Communications & PR, Brigade Enterprises Ltd.', category: 'advertiser' },
      { quoteSummary: 'DH & Prajavani part of Mahindra & Mahindra media plans, cost effective advertising across Karnataka.', name: 'K. Kalyanraman', title: 'DGM - Media & Advertising, Mahindra & Mahindra', category: 'advertiser' },
      { quoteSummary: 'Ganjam has advertised in DH & Prajavani for decades, exceeding expectations.', name: 'Umesh Ganjam', title: 'Managing Director, Ganjam', category: 'advertiser' },
      { quoteSummary: 'DH and Prajavani extremely supportive, valuable long-term relationship.', name: 'Rajkumar Pai', title: 'Managing Director, Pai International', category: 'advertiser' },
    ],
  });

  // ---- 8. Case studies ----
  await prisma.caseStudy.createMany({
    data: [
      { title: 'Celebrating World Heart Day with Manipal', description: 'DH Brandspot conceptualized and executed a week-long campaign for Manipal Hospital including CPR Lifesaver training sessions, Heartathon fitness program, emergency ambulance services facilitation, and a social media awareness drive.' },
      { title: 'AMFI - Investor Awareness Programmes', description: "AMFI partnered with Deccan Herald and Prajavani for the 'Bharat Nivesh Yatra' across 12 key cities in Karnataka, engaging 800+ attendees on mutual fund investment fundamentals." },
      { title: 'Dealer Meet & Product Launch - Eco Crystal', description: 'DH Brandspot curated a product launch for Euraqua Water Softener featuring celebrity artist Rukmini Vijayakumar and expert talks by Belgian manufacturers.' },
      { title: 'Dozee Care Tech', description: 'DH Brandspot curated an invite-only event introducing medical professionals to critical care technology through expert talks, panel discussions, and experiential zones.' },
      { title: 'Deeksha Indian Postal Service Awareness Campaign', description: 'An activation promoting handwritten letters, where Deeksha students wrote and posted letters to loved ones, with the postman addressing the gathering.' },
    ],
  });

  // ---- 9. Offices + contacts ----
  const officesData: {
    city: string;
    address?: string;
    phone?: string;
    region: string;
    contacts: { role: string; name: string; phone?: string; email?: string }[];
  }[] = [
    {
      city: 'Bengaluru',
      address: 'The Printers (Mysore) Private Limited, #75, MG Road, Bengaluru - 560001',
      phone: '080-45557333/325',
      region: 'karnataka',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr. KV Subramanya', phone: '+91 80455 57300', email: 'kvsubramanya@deccanherald.co.in' },
        { role: 'For Digital & Native Ads', name: 'Suhaib Husain', phone: '+91 98401 49519', email: 'suhaib.husain@printersmysore.co.in' },
        { role: 'Prajavani Editorial', name: 'Mr. Ravindra G Bhat', phone: '+91 80455 57231', email: 'ravindrabhat@prajavani.co.in' },
        { role: 'For Print Advertisements', name: 'Mr. Chandrasekaran V', phone: '080-45557167', email: 'chandrasekaran.v@deccanherald.co.in' },
        { role: 'Circulation Bangalore', name: 'Shankar N R', phone: '+91 97312 34539', email: 'nr.shankar@deccanherald.co.in' },
      ],
    },
    {
      city: 'Hubballi',
      address: 'The Printers (Mysore) Private Limited, Shivabasava Arcade, 2nd floor, behind Ambesh Hotel, Vidhyanagar, PB Road, Hubballi - 580021',
      region: 'karnataka',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr. Venkataraj KG', phone: '+91 99720 32575', email: 'venkataraj.kg@deccanherald.co.in' },
        { role: 'Prajavani Editorial', name: 'Mr Rahul Belagali', phone: '+91 94484 70167', email: 'rahul.belagali@prajavani.co.in' },
        { role: 'For Print Advertisements', name: 'Mr. Divakar D', phone: '+91 94484 68405', email: 'hubliads@deccanherald.co.in' },
      ],
    },
    {
      city: 'Mysuru',
      address: 'The Printers (Mysore) Private Limited, No. 363, 1st Floor, Sri Hari complex, Sitavilasa Road, Chamaraja Mohalla, Mysuru - 570024',
      region: 'karnataka',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr. T R Sathish Kumar', phone: '+91 99869 90522', email: 'dhmysore@deccanherald.co.in' },
        { role: 'Prajavani Editorial', name: 'Mr. Narasimha Murthy K', phone: '+91 94484 70176', email: 'knmurthy@prajavani.co.in' },
        { role: 'For Print Advertisements', name: 'S Kandan Rao', phone: '+91 74111 36141', email: 'mysoreads@deccanherald.co.in' },
      ],
    },
    {
      city: 'Davanagere',
      address: 'The Printers (Mysore) Private Ltd, #171/4, AB Shastry Bhavana, 3rd Main Road, PJ Extension, Davanagere - 577002',
      region: 'karnataka',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr Nrupatunga HK', phone: '+91 96069 31787', email: 'nrupathunga@deccanherald.co.in' },
        { role: 'Prajavani Editorial', name: 'Mr. Siddayya S Hiremath', phone: '+91 9448 470156', email: 'siddayyas@prajavani.co.in' },
      ],
    },
    {
      city: 'Mangaluru',
      address: 'The Printers (Mysore) Private Ltd, 111/12, 2nd Floor, Yenepoya Chambers, Balmatta, Mangaluru - 575002',
      region: 'karnataka',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr Harsha A', phone: '+91 99862 97256', email: 'harsha@deccanherald.co.in' },
        { role: 'Prajavani Editorial', name: 'Mr. Ganesh D Chandanashiv', phone: '+91 94484 01611', email: 'ganeshd@prajavani.co.in' },
      ],
    },
    {
      city: 'Kalaburagi',
      address: '#1-101/A, 2nd Floor, Krishna Krupa, Opposite Kannada Bhavan, Main Road, SVP Circle, Gulbarga - 585102',
      region: 'karnataka',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr Gururaj B R', phone: '+91 94804 15291', email: 'gururaj.br@deccanherald.co.in' },
        { role: 'Prajavani Editorial', name: 'Mr Vinayak Bhat', phone: '+91 94484 70167', email: 'vinayakbhat@prajavani.co.in' },
      ],
    },
    {
      city: 'Belagavi',
      region: 'karnataka',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr. Raju Gavali', phone: '+91 94486 92064', email: 'rajugavali@deccanherald.co.in' },
        { role: 'Prajavani Editorial', name: 'Santosh I Chinagudi', phone: '+91 94484 70138', email: 'santosh_chinagudi@prajavani.co.in' },
      ],
    },
    {
      city: 'Tumakuru',
      region: 'karnataka',
      contacts: [
        { role: 'Prajavani Editorial', name: 'Mr. Mariyappa K J', phone: '+91 94484 70165', email: 'mariyappa@prajavani.co.in' },
      ],
    },
    {
      city: 'Hassan',
      region: 'karnataka',
      contacts: [
        { role: 'Prajavani Editorial', name: 'Chidambaraprasad', phone: '+91 94484 70159', email: 'chidambara.prasad@prajavani.co.in' },
      ],
    },
    {
      city: 'Kolar',
      region: 'karnataka',
      contacts: [
        { role: 'Prajavani Editorial', name: 'Onkara Murthy K', phone: '+91 94484 70161', email: 'onkarmurthy@prajavani.co.in' },
      ],
    },
    {
      city: 'New Delhi',
      address: 'The Printers (Mysore) Private Limited, 2/5, INS Building, Rafi Marg, New Delhi - 110001',
      region: 'national',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr Sumit Pande', phone: '+91 98117 06345', email: 'sumit.pande@deccanherald.co.in' },
        { role: 'Prajavani Editorial', name: 'Manjunath Hebbar', phone: '+91 99162 40432', email: 'manjunathhebbar@prajavani.co.in' },
      ],
    },
    {
      city: 'Mumbai',
      address: 'TPML, No 101, A Wing, Mittal Commercial Co-Op Society, Vill Marol, Off M V Road, Near Mittal Estate, Andheri(East), Mumbai - 400059',
      region: 'national',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr. Mrityunjay Bose', phone: '+91 98925 41019', email: 'mrityunjay_bose@deccanherald.co.in' },
      ],
    },
    {
      city: 'Chennai',
      address: 'The Printers (Mysore) Pvt. Ltd., Prestige Point, Flat No. 2A, Ground Floor, 47/2, Haddows Road, Nungambakkam, Chennai - 600006',
      phone: '044 4867 2237',
      region: 'national',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr E T B Sivapriyan', phone: '044 4867 2234', email: 'sivapriyan.etb@deccanherald.co.in' },
      ],
    },
    {
      city: 'Hyderabad',
      address: 'TPML, 301A, 3rd Floor, Down Town Hall, Lakhdikapool, Humayun Nagar, Hyderabad - 500028',
      region: 'national',
      contacts: [
        { role: 'Deccan Herald Editorial', name: 'Mr SNV Sudhir', phone: '+91 95507 99111', email: 'sudhir@deccanherald.co.in' },
      ],
    },
    {
      city: 'Kolkata',
      address: "The Printers (Mysore) Pvt. Ltd., Jindal Towers, Block 'B', Room No. 310, 3rd Floor, 21/1A/3, Darga Road, Kolkata - 700017",
      phone: '033-2280 7437',
      region: 'national',
      contacts: [
        { role: 'For Print Advertisements', name: 'Mr. Manjit Singh', phone: '+91 33 2290 2529', email: 'manjit.singh@printersmysore.co.in' },
      ],
    },
  ];

  for (const o of officesData) {
    const created = await prisma.office.create({
      data: {
        city: o.city,
        address: o.address,
        phone: o.phone,
        region: o.region,
      },
    });
    await prisma.officeContact.createMany({
      data: o.contacts.map((c) => ({ ...c, officeId: created.id })),
    });
  }

  console.log('Seed complete.');
  console.log('\nDev login credentials (also in SEED_CREDENTIALS.md):');
  for (const [email, password] of Object.entries(DEV_PASSWORDS)) {
    console.log(`  ${email} / ${password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
