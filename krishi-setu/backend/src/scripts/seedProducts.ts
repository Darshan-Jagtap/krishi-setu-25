import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import User from '../models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrichain';

const sampleProducts = [
    {
        name: 'Soybean Meal',
        description: 'High-quality soybean meal, rich in protein. Perfect for animal feed and agricultural use.',
        category: 'meal',
        price: 45,
        quantity: 5000,
        unit: 'kg',
        location: 'Maharashtra, India',
        status: 'available',
    },
    {
        name: 'Mustard Cake',
        description: 'Premium mustard cake with excellent nutritional value. Ideal for organic farming.',
        category: 'cake',
        price: 28,
        quantity: 3000,
        unit: 'kg',
        location: 'Rajasthan, India',
        status: 'available',
    },
    {
        name: 'Groundnut Husk',
        description: 'Quality groundnut husk for industrial and agricultural applications.',
        category: 'husk',
        price: 15,
        quantity: 8000,
        unit: 'kg',
        location: 'Gujarat, India',
        status: 'available',
    },
    {
        name: 'Sunflower Meal',
        description: 'Premium sunflower meal with high protein content. Export quality.',
        category: 'meal',
        price: 38,
        quantity: 4500,
        unit: 'kg',
        location: 'Karnataka, India',
        status: 'available',
    },
];

const seedProducts = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find a user to be the seller (or create one)
        let seller = await User.findOne({ role: 'farmer' });

        if (!seller) {
            console.log('Creating default seller user...');
            seller = await User.create({
                email: 'seller@agrichain.com',
                password: 'password123',
                full_name: 'Green Valley Processors',
                role: 'farmer',
                phone: '+91 9876543210',
                location: 'Maharashtra, India'
            });
            console.log('✅ Default seller created');
        }

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Create products
        const products = sampleProducts.map(product => ({
            ...product,
            seller_id: seller!._id
        }));

        await Product.insertMany(products);
        console.log(`✅ Created ${products.length} sample products`);

        console.log('\n📦 Sample Products:');
        products.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} - ₹${p.price}/${p.unit} (${p.quantity} ${p.unit} available)`);
        });

        console.log('\n✅ Seed completed successfully!');
        console.log('\n📝 Seller credentials:');
        console.log(`   Email: ${seller.email}`);
        console.log(`   Password: password123`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedProducts();
