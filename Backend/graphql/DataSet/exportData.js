const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = 'mongodb+srv://capstone883:Capstone123@cluster0.bq8yack.mongodb.net/PetPoojaDB?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function exportData() {
  try {
    await client.connect();
    const database = client.db('PetPoojaDB');
    const collections = await database.listCollections().toArray();

    for (let collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = database.collection(collectionName);
      const documents = await collection.find({}).toArray();
      fs.writeFileSync(`${collectionName}.json`, JSON.stringify(documents, null, 2));
      console.log(`Exported ${documents.length} documents from ${collectionName} to ${collectionName}.json`);
    }
  } finally {
    await client.close();
  }
}

exportData().catch(console.dir);
