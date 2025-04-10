import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");


app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);

app.get("/", async (req, res) => {
  const currencies = ["USD", "EUR", "CNY", "DKK", "GBP", "JPY", "KRW", "NOK"];
  const rates = {};

  try {
    // Loop through each currency and get its conversion to BRL
    for (const currency of currencies) {
      const response = await axios.get(
        `https://api.frankfurter.app/latest?from=${currency}&to=BRL`
      );
      rates[currency] = response.data.rates.BRL;
    }

    res.render("index.ejs", { rates });
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error.message);
    res.render("index.ejs", {
      error: error.message,
      rates: {},
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});