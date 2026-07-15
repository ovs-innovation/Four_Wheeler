const Brand = require('../models/brand.model');
const Car = require('../models/car.model');
const News = require('../models/news.model');
const Blog = require('../models/blog.model');
const Admin = require('../models/admin.model');

const seedData = async () => {
  try {
    // 0. Seed Default Admin Accounts
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('MongoDB: Seeding default administrator account...');
      await Admin.create({
        name: 'Aditya Sharma',
        email: 'admin@fourwheeler.com',
        password: 'password123',
        role: 'superadmin',
        status: 'active'
      });
      console.log('MongoDB: Default admin seeded (admin@fourwheeler.com / password123)');
    }

    // 1. Seed Brands
    const brandCount = await Brand.countDocuments();
    if (brandCount === 0) {
      console.log('MongoDB: Seeding Brands collection...');
      const defaultBrands = [
        { name: 'Porsche', slug: 'porsche', country: 'Germany', isPopular: true, logo: '', banner: '', status: 'published' },
        { name: 'Tesla', slug: 'tesla', country: 'USA', isPopular: true, logo: '', banner: '', status: 'published' },
        { name: 'BMW', slug: 'bmw', country: 'Germany', isPopular: true, logo: '', banner: '', status: 'published' },
        { name: 'Mercedes-Benz', slug: 'mercedes', country: 'Germany', isPopular: true, logo: '', banner: '', status: 'published' },
        { name: 'Mahindra', slug: 'mahindra', country: 'India', isPopular: true, logo: '', banner: '', status: 'published' },
        { name: 'Audi', slug: 'audi', country: 'Germany', isPopular: false, logo: '', banner: '', status: 'published' },
        { name: 'Land Rover', slug: 'landrover', country: 'UK', isPopular: false, logo: '', banner: '', status: 'published' },
        { name: 'Lamborghini', slug: 'lamborghini', country: 'Italy', isPopular: false, logo: '', banner: '', status: 'published' },
        { name: 'Lexus', slug: 'lexus', country: 'Japan', isPopular: false, logo: '', banner: '', status: 'published' }
      ];
      await Brand.insertMany(defaultBrands);
      console.log(`MongoDB: Seeded ${defaultBrands.length} Brands successfully.`);
    }

    // 2. Seed Cars
    const carCount = await Car.countDocuments({ isDeleted: { $ne: true } });
    if (carCount === 0) {
      console.log('MongoDB: Seeding Cars collection...');
      const defaultCars = [
        {
          id: 1,
          modelName: '911 GT3 RS',
          title: '2024 Porsche 911 GT3 RS',
          slug: '2024-porsche-911-gt3-rs',
          price: 27500000,
          condition: 'NEW',
          mileage: 120,
          transmission: 'AUTOMATIC',
          fuelType: 'PETROL',
          bodyType: 'Coupe',
          engineSize: '4.0L Flat-6',
          engineCC: 3996,
          power: 518,
          torque: 465,
          groundClearance: 100,
          safetyRating: 5,
          year: 2024,
          overview: 'The Porsche 911 GT3 RS is designed for maximum track performance. Features a high-revving naturally aspirated engine, motorsport-derived active aerodynamics, and sophisticated lightweight construction.',
          description: 'The Porsche 911 GT3 RS is designed for maximum track performance. Features a high-revving naturally aspirated engine, motorsport-derived active aerodynamics, and sophisticated lightweight construction.',
          thumbnail: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
          galleryImages: [
            'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
          ],
          images: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
          colorOptions: 'Signal Green,Guards Red,Chalk',
          featured: true,
          sellerId: 'dealer_apex',
          brandId: 'brand_porsche',
          brand: 'Porsche',
          brandSlug: 'porsche',
          modelId: 'model_911',
          sellerName: 'Apex Motors India',
          sellerPhone: '+91 98888 88888',
          sellerCity: 'Mumbai',
          sellerRole: 'DEALER',
          status: 'APPROVED'
        },
        {
          id: 2,
          modelName: 'Model S Plaid',
          title: '2023 Tesla Model S Plaid',
          slug: '2023-tesla-model-s-plaid',
          price: 13500000,
          condition: 'USED',
          mileage: 8500,
          transmission: 'AUTOMATIC',
          fuelType: 'ELECTRIC',
          bodyType: 'Sedan',
          engineSize: 'Tri-Motor Electric',
          engineCC: 0,
          power: 1020,
          torque: 1420,
          groundClearance: 115,
          safetyRating: 5,
          year: 2023,
          overview: 'The ultimate electric performance sedan. Features 1020 peak horsepower, tri-motor all-wheel drive, carbon-sleeved rotors, and torque vectoring. Impeccable condition, single owner.',
          description: 'The ultimate electric performance sedan. Features 1020 peak horsepower, tri-motor all-wheel drive, carbon-sleeved rotors, and torque vectoring. Impeccable condition, single owner.',
          thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
          galleryImages: [
            'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
          ],
          images: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
          colorOptions: 'Solid Black,Pearl White,Ultra Red',
          featured: true,
          sellerId: 'seller_vikram',
          brandId: 'brand_tesla',
          brand: 'Tesla',
          brandSlug: 'tesla',
          modelId: 'model_s',
          sellerName: 'Vikram Singh',
          sellerPhone: '+91 97777 77777',
          sellerCity: 'Bengaluru',
          sellerRole: 'INDIVIDUAL_SELLER',
          status: 'APPROVED'
        },
        {
          id: 3,
          modelName: 'i7 xDrive60',
          title: '2024 BMW i7 xDrive60',
          slug: '2024-bmw-i7-xdrive60',
          price: 21500000,
          condition: 'NEW',
          mileage: 50,
          transmission: 'AUTOMATIC',
          fuelType: 'ELECTRIC',
          bodyType: 'Sedan',
          engineSize: 'Dual-Motor Electric',
          engineCC: 0,
          power: 536,
          torque: 745,
          groundClearance: 136,
          safetyRating: 5,
          year: 2024,
          overview: 'The all-electric luxury sedan combining premium performance with futuristic tech. Includes the ultra-wide 31.3" rear Theatre Screen, executive lounge seating, and BMW xDrive dual-motor architecture.',
          description: 'The all-electric luxury sedan combining premium performance with futuristic tech. Includes the ultra-wide 31.3" rear Theatre Screen, executive lounge seating, and BMW xDrive dual-motor architecture.',
          thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
          galleryImages: [
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=800'
          ],
          images: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=800',
          colorOptions: 'Oxide Grey,Mineral White,Black Sapphire',
          featured: true,
          sellerId: 'dealer_apex',
          brandId: 'brand_bmw',
          brand: 'BMW',
          brandSlug: 'bmw',
          modelId: 'model_i7',
          sellerName: 'Apex Motors India',
          sellerPhone: '+91 98888 88888',
          sellerCity: 'Mumbai',
          sellerRole: 'DEALER',
          status: 'APPROVED'
        },
        {
          id: 4,
          modelName: 'G-Class G 400d',
          title: '2023 Mercedes-Benz G-Class G 400d AMG Line',
          slug: '2023-mercedes-benz-g-class-g-400d-amg-line',
          price: 25500000,
          condition: 'CERTIFIED_PRE_OWNED',
          mileage: 14000,
          transmission: 'AUTOMATIC',
          fuelType: 'DIESEL',
          bodyType: 'SUV',
          engineSize: '3.0L Inline-6 Turbo',
          engineCC: 2925,
          power: 326,
          torque: 700,
          groundClearance: 241,
          safetyRating: 5,
          year: 2023,
          overview: 'An icon of adventure and luxury. Featuring standard three differential locks, premium AMG body configurations, high-end Nappa leather, and robust 700 Nm diesel torque for off-road excellence.',
          description: 'An icon of adventure and luxury. Featuring standard three differential locks, premium AMG body configurations, high-end Nappa leather, and robust 700 Nm diesel torque for off-road excellence.',
          thumbnail: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&q=80&w=800',
          galleryImages: [
            'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
          ],
          images: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
          colorOptions: 'Obsidian Black,Emerald Green',
          featured: false,
          sellerId: 'dealer_apex',
          brandId: 'brand_mercedes',
          brand: 'Mercedes-Benz',
          brandSlug: 'mercedes',
          modelId: 'model_gclass',
          sellerName: 'Apex Motors India',
          sellerPhone: '+91 98888 88888',
          sellerCity: 'Mumbai',
          sellerRole: 'DEALER',
          status: 'APPROVED'
        },
        {
          id: 5,
          modelName: 'Thar LX',
          title: '2022 Mahindra Thar LX Diesel Manual',
          slug: '2022-mahindra-thar-lx-diesel-manual',
          price: 1550000,
          condition: 'USED',
          mileage: 24000,
          transmission: 'MANUAL',
          fuelType: 'DIESEL',
          bodyType: 'SUV',
          engineSize: '2.2L mHawk',
          engineCC: 2184,
          power: 130,
          torque: 300,
          groundClearance: 226,
          safetyRating: 4,
          year: 2022,
          overview: 'The ideal off-road SUV for India. Features shift-on-the-fly 4WD transfer case, mechanically locking rear differential, independent front suspension, and premium hardtop roof configurations.',
          description: 'The ideal off-road SUV for India. Features shift-on-the-fly 4WD transfer case, mechanically locking rear differential, independent front suspension, and premium hardtop roof configurations.',
          thumbnail: 'https://images.unsplash.com/photo-1669818420387-a2f07efd8fe0?auto=format&fit=crop&q=80&w=800',
          galleryImages: ['https://images.unsplash.com/photo-1669818420387-a2f07efd8fe0?auto=format&fit=crop&q=80&w=800'],
          images: 'https://images.unsplash.com/photo-1669818420387-a2f07efd8fe0?auto=format&fit=crop&q=80&w=800',
          colorOptions: 'Napoli Black,Red Rage,Aquamarine',
          featured: false,
          sellerId: 'seller_vikram',
          brandId: 'brand_mahindra',
          brand: 'Mahindra',
          brandSlug: 'mahindra',
          modelId: 'model_thar',
          sellerName: 'Vikram Singh',
          sellerPhone: '+91 97777 77777',
          sellerCity: 'Alwar',
          sellerRole: 'INDIVIDUAL_SELLER',
          status: 'APPROVED'
        }
      ];

      await Car.insertMany(defaultCars);
      console.log(`MongoDB: Seeded ${defaultCars.length} Cars successfully.`);
    }

    // 3. Seed News / Blogs
    const newsCount = await News.countDocuments();
    const blogCount = await Blog.countDocuments();
    if (newsCount === 0 && blogCount === 0) {
      console.log('MongoDB: Seeding Blogs & News collection...');
      const defaultBlogs = [
        {
          id: 1,
          title: 'Top 5 Luxury Electric Vehicles to Buy in India in 2026',
          slug: 'top-5-luxury-evs-india-2026',
          description: 'Evaluate the best luxury electric vehicle models currently available in the Indian market.',
          content: 'As electric vehicles dominate the luxury segment, we evaluate the best models currently available in India. From the dual-screen experience of the BMW i7 to the speed parameters of the Porsche Taycan, we break down power outputs, range configurations, and charging setups. Buyers can expect significant enhancements in real-world driving mileage, autonomous driver aids (ADAS), and ultra-fast charging capabilities that restore battery capacities in under twenty minutes.',
          image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
          date: 'June 15, 2026',
          category: 'EV Guide',
          readTime: '5 min read',
          author: 'Vikram Mehta',
          createdAt: new Date('2026-06-15T12:00:00Z')
        },
        {
          id: 2,
          title: 'The Porsche 911 GT3 RS: Track Performance Redefined',
          slug: 'porsche-911-gt3-rs-review-track',
          description: 'A comprehensive review of the active aerodynamics and track mechanics on the latest GT3 RS.',
          content: 'The GT3 RS is Porsche’s purebred track machine disguised in street license plates. With active drag reduction system (DRS) aerodynamics and a 4.0L naturally aspirated flat-6 howling at 9,000 RPM, it pushes the boundaries of internal combustion engineering. Dynamic lightweight body panels and magnesium wheel options minimize weight indexes to extreme track ratios.',
          image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
          date: 'July 02, 2026',
          category: 'Supercars',
          readTime: '4 min read',
          author: 'Arjun Sen',
          createdAt: new Date('2026-07-02T12:00:00Z')
        }
      ];

      await Blog.insertMany(defaultBlogs);
      await News.insertMany(defaultBlogs); // seed news as well
      console.log(`MongoDB: Seeded ${defaultBlogs.length} articles successfully.`);
    }
  } catch (error) {
    console.error('MongoDB Data Seeder Error:', error.message);
  }
};

module.exports = seedData;
