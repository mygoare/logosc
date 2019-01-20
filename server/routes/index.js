const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const url = 'https://www.logosc.cn/make?n=树莓派&s=&tag=教育&color=7';

const router = express.Router();

router.get('/crawler', (req, res, next) => {
  const baseUrl = 'https://www.logosc.cn';
  const {
    mainTitle,
    subTitle,
    tag,
    color,
  } = req.query;

  const u = `${baseUrl}/make?n=${mainTitle}&s=${subTitle}&tag=${tag}&color=${color}`;


  puppeteer
    .launch({ args: ['--no-sandbox']})
    .then(function(browser) {
      return browser.newPage();
    })
    .then(function(page) {
      return page.goto(u, {"waitUntil" : "networkidle0"}).then(function() {
        return page.content();
      });
    })
    .then(function(html) {
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

    })
    .catch(function(err) {
      next(err);
    });
});


module.exports = router;
