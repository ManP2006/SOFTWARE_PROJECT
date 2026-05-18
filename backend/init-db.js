import mongoose from 'mongoose';
import 'dotenv/config';
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

async function initDatabase() {
    console.log("Connecting to MongoDB Atlas...");
    try {
        // Connect to the specific database listed in the .env file
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log("Connected successfully!");
        console.log("Creating 'payroll_db' database by inserting a setup document...");

        // Define a temporary schema just to force the database creation
        const InitSchema = new mongoose.Schema({
            status: String,
            createdAt: { type: Date, default: Date.now }
        });
        
        const InitModel = mongoose.model('SystemSetup', InitSchema);

        // Inserting data into MongoDB automatically creates the Database and Collection
        await InitModel.create({ status: "Database 'payroll_db' has been successfully created and is ready to use!" });

        console.log("✅ Success! The database has been created.");
        console.log("You can now go to the MongoDB Atlas 'Browse Collections' tab to see it.");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to create database:", error);
        process.exit(1);
    }
}

initDatabase();
