# Description
#   A Hubot script that returns speakerdeck talks
#
# Configuration:
#   None
#
# Commands:
#   hubot speakerdeck <user> - speakerdeck talks
#
# Author:
#   bouzuya <m@bouzuya.net>
#
module.exports = (robot) ->
  request = require 'request-b'
  cheerio = require 'cheerio'

  robot.respond /speakerdeck (\S+)$/i, (res) ->
    user = res.match[1]
    baseUrl = 'https://speakerdeck.com'
    url = "#{baseUrl}/#{user}/"
    request(url).then (r) ->
      $ = cheerio.load r.body
      talks = []
      $('.talk.public').each ->
        e = $ @
        url = baseUrl + e.find('.title a').attr('href')
        title = e.find('.title').text().trim()
        date = e.find('.date').text().trim().split('\n').map (s) ->
          s.trim()
        .join(' ')
        talks.push { title, date, url }
      message = talks.map (i) ->
        "#{i.title} #{i.date} #{i.url}"
      .join '\n'
      res.send message
