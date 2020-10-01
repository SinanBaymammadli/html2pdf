// import htmlToPdf from "html-pdf";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const html = req.body.html;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const buffer = await page.pdf();

  await browser.close();

  // htmlToPdf.create(html).toBuffer(function (error, buffer) {
  //   if (error) {
  //     return res.status(400).json({ error });
  //   }

  return res.json({
    pdf: buffer.toString("base64"),
  });
  // });
};
