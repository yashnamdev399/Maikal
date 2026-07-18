/**
 * Seed script for MongoDB Atlas
 * Run: npm run seed
 * Seeds admin user, products, hero slides, and testimonials
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');
const Product = require('../models/Product');
const HeroSlide = require('../models/HeroSlide');
const Testimonial = require('../models/Testimonial');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // --- Admin ---
    const existingAdmin = await Admin.findOne({ email: 'admin@maikalnatural.org' });
    if (!existingAdmin) {
      const hash = await bcrypt.hash('Maikal@2024', 10);
      await Admin.create({ name: 'Admin', email: 'admin@maikalnatural.org', password: hash });
      console.log('✅ Admin seeded');
    } else {
      console.log('⏭️  Admin already exists');
    }

    // --- Products ---
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        { name_en: 'Desi Chana', name_hi: 'देसी चना', description_en: 'Naturally grown desi chickpeas, chemical-free', description_hi: 'प्राकृतिक रूप से उगाया गया देसी चना, रसायन मुक्त', price: 120, unit: 'per kg', category: 'Pulses', in_stock: true },
        { name_en: 'Chana Dal', name_hi: 'चना दाल', description_en: 'Pure split chickpea lentils, handmade by women SHG', description_hi: 'शुद्ध चना दाल, महिला स्वयं सहायता समूह द्वारा निर्मित', price: 130, unit: 'per kg', category: 'Pulses', in_stock: true },
        { name_en: 'Pissi Haldi', name_hi: 'पीसी हल्दी', description_en: 'Pure ground turmeric, naturally grown', description_hi: 'शुद्ध पिसी हल्दी, प्राकृतिक रूप से उगाई गई', price: 180, unit: 'per 250g', category: 'Spices', in_stock: true },
        { name_en: 'Bareek Saunf', name_hi: 'बारीक सौंफ', description_en: 'Fine fennel seeds, chemical-free', description_hi: 'बारीक सौंफ, रसायन मुक्त', price: 100, unit: 'per 250g', category: 'Spices', in_stock: true },
        { name_en: 'Khada Dhaniya', name_hi: 'खड़ा धनिया', description_en: 'Whole coriander seeds, naturally grown', description_hi: 'खड़ा धनिया, प्राकृतिक', price: 90, unit: 'per 250g', category: 'Spices', in_stock: true },
        { name_en: 'Bareek Rai', name_hi: 'बारीक राई', description_en: 'Fine mustard seeds, pure and natural', description_hi: 'बारीक राई, शुद्ध और प्राकृतिक', price: 80, unit: 'per 250g', category: 'Spices', in_stock: true },
        { name_en: 'Gud', name_hi: 'गुड़', description_en: 'Pure jaggery, traditionally made', description_hi: 'शुद्ध गुड़, पारंपरिक विधि से बना', price: 60, unit: 'per 500g', category: 'Sweeteners', in_stock: true },
        { name_en: 'Khada Moong', name_hi: 'खड़ा मूंग', description_en: 'Whole green gram, naturally grown', description_hi: 'खड़ा मूंग, प्राकृतिक', price: 110, unit: 'per kg', category: 'Pulses', in_stock: true },
        { name_en: 'Bareek Besan', name_hi: 'बारीक बेसन', description_en: 'Fine gram flour, handmade', description_hi: 'बारीक बेसन, हस्तनिर्मित', price: 90, unit: 'per 500g', category: 'Flour', in_stock: true },
        { name_en: 'Chawal Tukdi', name_hi: 'चावल टुकड़ी', description_en: 'Broken rice, naturally grown', description_hi: 'चावल टुकड़ी, प्राकृतिक', price: 55, unit: 'per kg', category: 'Grains', in_stock: true },
        { name_en: 'Khadi Tuar', name_hi: 'खड़ी तुअर', description_en: 'Whole pigeon pea, chemical-free', description_hi: 'खड़ी तुअर, रसायन मुक्त', price: 140, unit: 'per kg', category: 'Pulses', in_stock: true },
        { name_en: 'Tuar Dal', name_hi: 'तुअर दाल', description_en: 'Split pigeon pea lentils, pure', description_hi: 'तुअर दाल, शुद्ध', price: 150, unit: 'per kg', category: 'Pulses', in_stock: true },
      ]);
      console.log('✅ Products seeded (12)');
    } else {
      console.log(`⏭️  Products already exist (${productCount})`);
    }

    // --- Hero Slides ---
    const heroCount = await HeroSlide.countDocuments();
    if (heroCount === 0) {
      await HeroSlide.insertMany([
        { sort_order: 1, badge_en: "Maa Narmada's Ecosystem", badge_hi: 'माँ नर्मदा का पारिस्थितिकी तंत्र', title_en: 'Pure Nature,', title_hi: 'शुद्ध प्रकृति,', accent_en: 'Delivered to You', accent_hi: 'आपके द्वार तक', tagline_en: 'रसायन मुक्त / प्राकृतिक सामग्री उपलब्ध', tagline_hi: 'Chemical-free / Natural Products Available', desc_en: 'Handmade by women self-help groups. Straight from the Narmada valley fields to your home.', desc_hi: 'महिला स्वयं सहायता समूह द्वारा हस्तनिर्मित। नर्मदा घाटी के खेतों से सीधे आपके घर तक।', badge_float_en: '100% Chemical Free', badge_float_hi: '100% रसायन मुक्त' },
        { sort_order: 2, badge_en: 'Chemical-Free Harvest', badge_hi: 'रसायन मुक्त फसल', title_en: 'Naturally Grown,', title_hi: 'प्राकृतिक रूप से उगाया,', accent_en: 'Full of Flavour', accent_hi: 'स्वाद से भरपूर', tagline_en: 'मिट्टी का स्वाद, पीढ़ियों की परंपरा', tagline_hi: 'Taste of soil, tradition of generations', desc_en: 'Turmeric, mustard, besan, chana, gud — each product is grown with heirloom seeds and traditional methods.', desc_hi: 'हल्दी, सरसों, बेसन, चना, गुड़ — हर उत्पाद पारंपरिक बीजों और विधियों से उगाया जाता है।', badge_float_en: '12+ Natural Products', badge_float_hi: '12+ प्राकृतिक उत्पाद' },
        { sort_order: 3, badge_en: "Women's Enterprise", badge_hi: 'महिला उद्यम', title_en: 'Handcrafted by', title_hi: 'हस्तनिर्मित', accent_en: 'Women of Narmada', accent_hi: 'नर्मदा की महिलाओं द्वारा', tagline_en: '100+ महिला किसान, एक साझी कहानी', tagline_hi: '100+ women farmers, one shared story', desc_en: 'Every product you order supports a woman farmer. Every rupee goes back into her cooperative.', desc_hi: 'आपका हर ऑर्डर एक महिला किसान को सहारा देता है।', badge_float_en: '100+ Women Farmers', badge_float_hi: '100+ महिला किसान' },
      ]);
      console.log('✅ Hero slides seeded (3)');
    } else {
      console.log(`⏭️  Hero slides already exist (${heroCount})`);
    }

    // --- Testimonials ---
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.insertMany([
        { quote_en: 'The turmeric and mustard from Maikal are absolutely pure. You can taste the difference — no bitterness, just natural flavour. My whole family loves it!', quote_hi: 'मेकल की हल्दी और राई बिल्कुल शुद्ध हैं। फर्क साफ महसूस होता है — कोई कड़वाहट नहीं, बस प्राकृतिक स्वाद।', name: 'Sunita Verma', meta_en: 'Bhopal • Customer since 2023', meta_hi: 'भोपाल • 2023 से ग्राहक', avatar: '👩', rating: 5, sort_order: 1 },
        { quote_en: "Ordered the desi chana and besan together. Delivery was quick and the packaging was thoughtful. The besan makes the softest rotis I've ever had!", quote_hi: 'देसी चना और बेसन एक साथ मंगाया। डिलीवरी जल्दी हुई और पैकेजिंग बहुत अच्छी थी।', name: 'Rajesh Patel', meta_en: 'Indore • Customer since 2022', meta_hi: 'इंदौर • 2022 से ग्राहक', avatar: '👨', rating: 5, sort_order: 2 },
        { quote_en: "As a farmer from Narmada valley, I'm proud to be part of this initiative. Maikal supports us fairly and helps us reach customers who truly value natural produce.", quote_hi: 'नर्मदा घाटी के किसान के रूप में, मुझे इस पहल का हिस्सा होने पर गर्व है।', name: 'Ramesh Yadav', meta_en: 'Hoshangabad • Farmer Partner', meta_hi: 'होशंगाबाद • किसान साझेदार', avatar: '👨‍🌾', rating: 5, sort_order: 3 },
      ]);
      console.log('✅ Testimonials seeded (3)');
    } else {
      console.log(`⏭️  Testimonials already exist (${testCount})`);
    }

    console.log('\n🌿 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
