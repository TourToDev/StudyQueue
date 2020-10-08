# Bootcamp Assignment 2: Persisting data using MongoDB and Mongoose

Our application at this point has an issue one major issue...

- Each time the server starts, we reload the data from the same JSON file.

It would be better if the data was stored elsewhere in a _persistent_ fashion so that even if the server were to crash, our data would remain unharmed.

In this assignment, we will focus on persisting data by moving the JSON file to a dedicated database. In our case, we will be using [MongoDB](https://www.mongodb.org/), which stores data as **documents**. These documents are very similar to JSON objects, making MongoDB a good candidate for our web application.

### Mongoose

If you take a look at MongoDB's [introductory documentation](https://docs.mongodb.org/getting-started/node/introduction/), you will notice there's quite a bit of code that has to be written to add, find, update, or delete data using their APIs. [Mongoose](https://mongoosejs.com/docs/index.html) simplifies the process of communicating with MongoDB and also provides tools to organize/model the data into [**schemas**](https://mongoosejs.com/docs/guide.html). Schemas are used to pre-define the data attributes, and the type each attribute will have. [Read this tutorial that discusses how to use Mongoose with Node.js - uses callbacks](https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications) or [uses promises](https://developerhandbook.com/mongodb/connect-mongo-atlas-mongoose/) before continuing with the assignment.

### MongoDB

Setting up MongoDB is fairly simple. Just run the mongo daemon (mongod) and then run the mongo shell in another terminal.
<br/>

- ##### MacOS
  > https://treehouse.github.io/installation-guides/mac/mongo-mac.html
- ##### Windows
  > https://treehouse.github.io/installation-guides/windows/mongo-windows.html
- #### Ubuntu
  > https://itsfoss.com/install-mongodb-ubuntu/

Once you are in the mongo shell you will see something like [this](https://i.imgur.com/tCZ6V6P.png). Once you are here, look up some of the mongo shell commands.
Some commands you'll be using frequently are:

- show dbs ==> shows you a list of all of the available databases
- show collections ==> shows you a list of all of the collections (SQL tables equivalent)
- use <db name> ==> allows you to switch to the specified database (a.k.a. using the database)
- db.collection.functionGoesHere({yourFilter: infoHere}) -> db.footballClubs.find({school: "Florida"}) ==> finds ALL documents with a 'school' attribute with value 'Florida'
- db.dropDatabase() ==> drops the database that is currently in use

## Assignment Steps

**_*setup*_**:

1. Make sure to have MongoDB installed.
2. Clone your repository, navigate into it, then install all necessary packages with `npm i`.

**_config.js_**:

1. Create a new file called `config.js` within the root directory and paste this in it:

```js
export default {
  db: {
    uri:
      "", //place the URI of your mongo database here.
  },
};
```

2. Insert your MongoDB URI, which will be: `mongodb://127.0.0.1:27017/yourDatabaseName`
3. If you prefer to use the Atlas version, kindly follow the links provided below:
   - [Create an Atlas Account](https://docs.atlas.mongodb.com/tutorial/create-atlas-account/)
   - [Deploy a Free Tier Cluster](https://docs.atlas.mongodb.com/tutorial/deploy-free-tier-cluster/)
   - [Whitelist Your Connection IP Address](https://docs.atlas.mongodb.com/tutorial/whitelist-connection-ip-address/)
   - [Create a Database User for Your Cluster](https://docs.atlas.mongodb.com/tutorial/create-mongodb-user-for-cluster/)
   - [Connect to Your Cluster](https://docs.atlas.mongodb.com/tutorial/connect-to-your-cluster/)
   - [Insert and View Data in Your Cluster](https://docs.atlas.mongodb.com/tutorial/insert-data-into-your-cluster/)
   
**_connectMongodb.js_**:

1. Use the config to insert your database URI into the mongoose connection we defined for you.
2. Ensure it's working by running `jest footballClub.model.test.js` and seeing if you pass all the tests.

Make sure you're using the config to enter your Mongo URI, or else it will be public information when you push it to GitHub. If this portion isn't working, then future tests will not work since the database won't be connected.

**_footballClubModel.js_**:

1. Define your schema. Make sure all required fields are _actually_ required.
2. The schema should consist of the following attributes:
   - school :: String && required
   - mascot :: String && required
   - color :: String && required
   - conference :: String && required
   - search :: Array of String
3. Ensure your schema passes the tests by running `npm test` or `jest`. You will only pass the schema tests, it is okay to fail the rest of the tests for now.
4. If you are not sure what a schema is, please make sure to look into it!

An example schema might look like the following:

```js
const myPianoSchema = new mongoose.Schema({
  type: { type: String, required: true }, // a require string
  keycount: { type: mongoose.Number, required: true }, // a required number
  isElectronic: { type: Boolean }, // a boolean that could either be true or false
  users: [String], // an array of strings
  favoriteNotes: {
    // you can have objects like this one, accessing the children as favoriteNotes.note1 or favoriteNotes.note2
    note1: { type: String },
    note2: { type: String },
  },
});
```

**_readFile.js_**:
1. In this assignment, we would be using a promise to send back the data we get back after reading the `schools.json` JSON file
2. Read the `schools.json` JSON file and parse it, store the result in a variable.
3. Pass the resulting data stored in the variable to the resolve function as an argument


**_JSONtoMongo.js_**:
1. In saveDataInDB, use the footballClub and use the model you created in `footballClubModel.js` to save the 'document' into the database (read up on how to save models to the database).
2. In deleteDataInDB, use the footballClub and write code to delete all the documents in the database

**_queries.js_**:

1. Follow the instructions given in the comments of the boiler plate code given. Follow the link given (and please Google on your own as well) to get a better understanding of querying with Mongoose.
2. Verify that your outputs are correct for each function defined.
3. In the DisplayFormattedData, please make sure you write code to format the data to look like this (Example):
   ```js
   School: Virginia Tech
   Mascot: Hokies
   Color: #660000
   Conference: ACC
   Search: gohokies, va tech football, vt football, go hokies, vt_football, hokie football
   ```
4. Run `npm start`, and it should run the program!

## General Bootcamp Checklist

1. Make your changes to the bootcamp
2. Add your new files (if any) with: git add
3. Commit your changes with: git commit -am “this is what I did”
4. Upload your changes to github with: git push
5. Verify that you did things correctly by cloning your own project and testing it with: git clone
6. Run the automated tests on the cloned version of your project to make sure everything works so that you can get full credit.

## Grading (25 points)

1. Pass the following tests (without modifying the test files).
2. Run all of the following tests with npm test.
    - (2.5 points) jest test_connect.test.js
      - Don’t hardcode the link
      - Don’t upload your config.js
      - We will use our own setting by calling our own config.db.uri
    - (5 points) jest footballClub.model.test.js
    - (2.5 points) jest test_save.test.js
    - (7.5 points) jest test_queries_find.test.js
      - Each of the 3 find tests is worth 2.5 points
    - (2.5 points) jest test_queries_delete.test.js
    = (5 points) jest test_queries_update.test.js
