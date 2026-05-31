const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const products = [
  {
    id: 1,
    title: "Premium Ankara Fabric - Blue Pattern",
    seller: "Grace Fabrics Ltd",
    price: 25000,
    category: "fabrics"
  },
  {
    id: 2,
    title: "Rhapsody of Realities - 2026 Edition",
    seller: "Loveworld Books",
    price: 3500,
    category: "books"
  },
  {
    id: 3,
    title: "Organic Honey - 500ml",
    seller: "Pure Foods Nigeria",
    price: 8000,
    category: "foods"
  }
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});