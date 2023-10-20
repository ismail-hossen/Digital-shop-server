const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.mongo_url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = await client.db("digitalShop");
    const collection = await db.collection("product");

    app.get("/products-by-brand/:brand", async (req, res) => {
      const param = req.params.brand;
      const result = await collection.find({ brandName: param }).toArray();
      res.send(result);
    });

    app.get("/product-by-id/:id", async (req, res) => {
      const param = req.params.id;
      const result = await collection.findOne({ _id: new ObjectId(param) });
      res.send(result);
    });

    app.post("/add-product", async (req, res) => {
      const body = req.body;
      const result = await collection.insertOne(body);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
