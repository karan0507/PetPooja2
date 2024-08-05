const { MongoClient } = require('mongodb');

// MongoDB URI
const uri = 'mongodb+srv://capstone883:Capstone123@cluster0.bq8yack.mongodb.net/PetPoojaDB?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('PetPoojaDB');

    // Get all collections in the database
    const collections = await database.listCollections().toArray();

    for (let collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = database.collection(collectionName);
      
      console.log(`\nDocuments in '${collectionName}':`);
      const cursor = collection.find({});
      await cursor.forEach(document => {
        console.log(JSON.stringify(document, null, 2)); // Print each document formatted
      });
    }
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
