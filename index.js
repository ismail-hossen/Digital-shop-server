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
    const productCollection = await db.collection("product");
    const cartCollection = await db.collection("products_cart");

    app.get("/products-by-brand/:brand", async (req, res) => {
      const param = req.params.brand;
      const result = await productCollection
        .find({ brandName: param })
        .toArray();
      res.send(result);
    });

    app.get("/product-by-id/:id", async (req, res) => {
      const param = req.params.id;
      const result = await productCollection.findOne({
        _id: new ObjectId(param),
      });
      res.send(result);
    });

    app.post("/add-product", async (req, res) => {
      const body = req.body;
      const result = await productCollection.insertOne(body);
      res.send(result);
    });

    app.get("/add-to-cart/:email", async (req, res) => {
      const param = req.params.email;
      const result = await cartCollection.find({ email: param }).toArray();
      res.send(result);
    });

    app.post("/add-to-cart", async (req, res) => {
      const body = req.body;
      const result = await cartCollection.insertOne(body);
      res.send(result);
    });

    app.delete("/delete-from-cart/:id", async (req, res) => {
      const id = req.params.id;
      const result = await cartCollection.deleteOne({ _id: new ObjectId(id) });
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
