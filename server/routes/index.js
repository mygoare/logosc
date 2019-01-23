const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const url = 'https://www.logosc.cn/make?n=树莓派&s=&tag=教育&color=7';
const { proxy } = require('../config');

const router = express.Router();

router.get('/crawler', async (req, res, next) => {
  const baseUrl = 'https://www.logosc.cn';
  const {
    mainTitle,
    subTitle,
    tag,
    color,
  } = req.query;

  const u = `${baseUrl}/make?n=${mainTitle}&s=${subTitle}&tag=${tag}&color=${color}`;

  const args = [
    '--no-sandbox',
  ];
  if (proxy) {
    args.push('--proxy-server='+proxy.ip)
  }
  const browser = await puppeteer.launch({ args });

  try {
    const page = await browser.newPage();
    if (proxy && proxy.username && proxy.pwd) {
      await page.authenticate({
        username: proxy.username,
        password: proxy.pwd
      });
    }
    // https://stackoverflow.com/questions/46160929/puppeteer-wait-for-all-images-to-load-then-take-screenshot/46217285
    await page.goto(u, {"waitUntil" : "networkidle0"});
    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);
    const h2Content = [];


    const defs = $('div:first-child');
    $('pattern#watermark', defs).remove();


    $('.svg-card').each(function() {
      const text = $(this).html();

      $('.ShowPriceDetail', this).remove();
      $('svg > rect:nth-child(2)', this).remove();

      h2Content.push($(this).html());
    });


    res.json({
      defs: defs.html(),
      svgs: h2Content,
    })
  } catch (err) {
    await browser.close();
    next(err);
  }
});


module.exports = router;
