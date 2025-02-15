const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c9pict7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const regCollection = client.db("UserDB").collection("Register");
    const addCollection = client.db("UserDB").collection("AddTour");
    const tourspotCollection = client.db("UserDB").collection("TouristSpot");
    const countryCollection = client.db("UserDB").collection("CountryCard");

    //register api
    app.get("/register", async (req, res) => {
      const coursor = regCollection.find();
      const userreg = await coursor.toArray();
      res.send(userreg);
    });

    app.post("/register", async (req, res) => {
      const userreg = req.body;
      console.log(userreg);
      const result = await regCollection.insertOne(userreg);
      res.json(result);
    });

    //Add Tourist Spot api
    app.get("/addtour", async (req, res) => {
      const coursor = addCollection.find();
      const useradd = await coursor.toArray();
      res.send(useradd);
    });
    app.get("/addtour/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addCollection.findOne(query);
      res.send(result);
    });
    app.post("/addtour", async (req, res) => {
      const touradd = req.body;
      console.log(touradd);
      const result = await addCollection.insertOne(touradd);
      res.json(result);
    });

    // alltourists Api

    app.get("/alltourists", async (req, res) => {
      const coursor = tourspotCollection.find();
      const touristSpot = await coursor.toArray();
      res.send(touristSpot);
    });

    //contrycard api
    app.get("/country/:Country", async (req, res) => {
      console.log(req.params.Country);
      const result = await countryCollection
        .find({ Country: req.params.Country })
        .toArray();
      res.send(result);
    });
    //mylist api
    app.get("/mylist/:email", async (req, res) => {
      const result = await addCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.delete("/mylist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addCollection.deleteOne(query);
      res.json(result);
    });

    app.get("/mylistbyid/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await addCollection.findOne(query);
      res.send(result);
    });

    app.put("/mylistbyid/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = req.body;
      const Doc = {
        $set: {
          ImgUrl: updateDoc.ImgUrl,
          SpotName: updateDoc.SpotName,
          Country: updateDoc.Country,
          Location: updateDoc.Location,
          ShortDescription: updateDoc.ShortDescription,
          AvarageCost: updateDoc.AvarageCost,
          Seasonality: updateDoc.Seasonality,
          TravelTime: updateDoc.TravelTime,
          TotaVisitorsPerYear: updateDoc.TotaVisitorsPerYear,
        },
      };
      const result = await addCollection.updateOne(filter, Doc, options);
      res.send(result);
    });
    // Send a ping to confirm a successful connection

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assingment 10 Backend");
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
