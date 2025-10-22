const { MongoClient } = require('mongodb');

const drivers = [
    {
        name: "Lutfi Mawan",
        vehicleType: "Iris",
        isAvailable: false,
        rating: 5.0
    },
    {
        name: "Afif Ikram",
        vehicleType: "Myvi",
        isAvailable: true,
        rating: 4.4
    }
];

//show the data in the console
drivers.forEach(drivers => {
    console.log(drivers);
});


async function main() {

    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db("testDB");
        
        const driversCollection = db.collection("drivers");

      drivers.forEach(async (driver) => {
            const result = await driversCollection.insertOne(driver);
            console.log(`New driver created with result: ${result}`);
        });

        const updateResult = await db.collection ('drivers').updateOne(
            { name: "Afif Ikram" },
            { $inc: { rating: 0.1 } } );
        console.log(`Driver updated with result:  ${updateResult}`);

        const deleteResult = await db.collection('drivers').deleteOne({ isAvailable: false });
        console.log(`Driver deleted with result: ${deleteResult}`);

        }finally {
        await client.close();
        }
        }

        main();