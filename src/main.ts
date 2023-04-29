import express from "express";
import playwright from "playwright";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3033;

app.use(cors());
app.use(express.json());

app.post("/url-source", async (req, res) => {
  const { url } = req.body as { url: string };

  if (!url) {
    res.status(400).json({ statusCode: 400, message: "Missing url" });
    return;
  }

  try {
    const browser = await playwright.chromium.launch();

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);
    const html = await page.content();
    await browser.close();
    console.info("url-source::", url);
    res.status(200).json({ html });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
});

app.use((_, res) => {
  res.setHeader("Allow", "POST");
  res.status(405).end("Method Not Allowed");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
