// Description
//   A Hubot script that returns speakerdeck talks
//
// Configuration:
//   None
//
// Commands:
//   hubot speakerdeck <user> - speakerdeck talks
//
// Author:
//   bouzuya <m@bouzuya.net>
//
module.exports = function(robot) {
  var cheerio, request;
  request = require('request-b');
  cheerio = require('cheerio');
  return robot.respond(/speakerdeck (\S+)$/i, function(res) {
    var baseUrl, url, user;
    user = res.match[1];
    baseUrl = 'https://speakerdeck.com';
    url = "" + baseUrl + "/" + user + "/";
    return request(url).then(function(r) {
      var $, message, talks;
      $ = cheerio.load(r.body);
      talks = [];
      $('.talk.public').each(function() {
        var date, e, title;
        e = $(this);
        url = baseUrl + e.find('.title a').attr('href');
        title = e.find('.title').text().trim();
        date = e.find('.date').text().trim().split('\n').map(function(s) {
          return s.trim();
        }).join(' ');
        return talks.push({
          title: title,
          date: date,
          url: url
        });
      });
      message = talks.map(function(i) {
        return "" + i.title + " " + i.date + " " + i.url;
      }).join('\n');
      return res.send(message);
    });
  });
};
