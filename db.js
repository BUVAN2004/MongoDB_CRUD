const mongodb = require('mongodb');
const mongoclient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;

let database;

async function getdatabase(){
    const client = await mongoclient.connect('mongodb://127.0.0.1:27017')
    database = client.db('Office')

    if(!database) {console.log('Database Not connected');}

    return database;
}

module.exports = {
    getdatabase,
    ObjectID
}
