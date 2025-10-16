const { MongoClient } = require('mongodb');

const drivers = [
    {
        name: "Lutfi Mawan",
        vehicleType: "Iris",
        isAvailable: true,
        rating: 5.0
    },
    {
        name: "Afif Ikram",
        vehicleType: "Myvi",
        isAvailable: false,
        rating: 4.5
    }
];

//show the data in the console
drivers.forEach(driver => {
    console.log(drivers);
});


async function main() {

    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db("testDB");
        
        const driversCollection = db.collection("drivers");

        // Insert drivers sequentially and wait for each insert to finish
        for (const driver of drivers) {
            const result = await driversCollection.insertOne(driver);
            console.log(`New driver created with _id: ${result.insertedId}`);
        }

        const availableDrivers = await db.collection ('drivers').find({
            isAvailable: true,
            rating: { $gte: 4.5}
        }).toArray();
        console.log("Available drivers:", availableDrivers);

        }finally {
        await client.close();
        }
        }

        main();