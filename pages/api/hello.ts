// import htmlToPdf from "html-pdf";
import { NextApiRequest, NextApiResponse } from "next";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const isDev = process.env.NODE_ENV === "development";
/**
 * In order to have the function working in both windows and macOS
 * we need to specify the respecive path of the chrome executable for
 * both cases.
 */
const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export const getOptions = async (isDev) => {
  /**
   * If used in a dev environment, i.e. locally, use one of the local
   * executable path
   */
  if (isDev) {
    return {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  }
  /**
   * Else, use the path of chrome-aws-lambda and its args
   */
  return {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const html = req.body.html;

  const options = await getOptions(isDev);
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setContent(html);
  const buffer = await page.pdf();

  await browser.close();

  return res.json({
    pdf: buffer.toString("base64"),
  });
};
