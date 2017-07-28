const handlers = require('./handlers');
const request = require('request');
const crypto = require('crypto');
const env = require('env2')('.env');
const https = require('https');


const API_URL = "https://gateway.marvel.com/v1/public"


var logicObj = {

    resultsObj: {
      character: {
        name: '',
        image: '',
        description: '',
        id: 0
      },
      comic: {
        name: '',
        image: '',
        description: '',
        date: ''
      }
    },


    makeCharacterUrl: function(req) {
      const queryName = req.url.replace('/search/', '')
      const ts = Date.now()
      const hash = crypto.createHash('md5').update(ts + process.env.PRIV_KEY + process.env.API_KEY).digest('hex')
      const url = `${API_URL}/characters?name=${queryName}&apikey=${process.env.API_KEY}&ts=${ts}&hash=${hash}`
      return url;
    },

    makeComicUrl: function(req) {
      const ts = Date.now()
      const hash = crypto.createHash('md5').update(ts + process.env.PRIV_KEY + process.env.API_KEY).digest('hex')
      const characterId = logicObj.resultsObj.character.id
      const url = `${API_URL}/characters/${characterId}/comics?orderBy=-onsaleDate&apikey=${process.env.API_KEY}&ts=${ts}&hash=${hash}`
      return url;
    },

    apiCall: function(url, cb) {
      request(url, function(error, response, body) {

        if (error) {
          cb(error);
        } else {
          cb(null,body);
        }

      })
    },

    characterProfile: function(error, data) {

      if (error) {
        logicObj.resultsObj.character.id = 1;
        logicObj.resultsObj.character.name = 'Not found';
        logicObj.resultsObj.character.description = 'Please try another one';
        logicObj.resultsObj.character.image = 'https://media.giphy.com/media/nKN7E76a27Uek/giphy.gif';
        console.log('characterProfile has run - error');
        return
      }




    const parsed = JSON.parse(data);
    const emptyResults = parsed.data.results;
    const results = parsed.data.results[0];
      if (emptyResults.length === 0) {
        logicObj.resultsObj.character.id = 1;
        logicObj.resultsObj.character.name = 'Not found';
        logicObj.resultsObj.character.description = 'Please try another one';
        logicObj.resultsObj.character.image = 'https://media.giphy.com/media/nKN7E76a27Uek/giphy.gif';
        return
      }

      logicObj.resultsObj.character.id = results.id;
      logicObj.resultsObj.character.name = results.name;
      logicObj.resultsObj.character.description = results.description;
      logicObj.resultsObj.character.image = results.thumbnail.path + '.' + results.thumbnail.extension;
      return
    },



    comicProfile: function(error, data) {
      if (error) {
        return
      }

      const parsed = JSON.parse(data)
      const results = parsed.data.results[0]
      const emptyComicResults = parsed.data.results;


      if (emptyComicResults.length === 0) {
        return
      }

      logicObj.resultsObj.comic.date = results.dates[0].date;
      logicObj.resultsObj.comic.name = results.title;
      logicObj.resultsObj.comic.description = results.description;
      logicObj.resultsObj.comic.image = results.thumbnail.path + '.' + results.thumbnail.extension;
      return


  },


  waterfall: function(urlsArray, tasksArray, req, res) {
    if (tasksArray.length > 0) {

      var url = urlsArray[0](req);
      console.log('url: ', url);
      var remainingUrls = urlsArray.slice(1);
      var task = tasksArray[0];
      var remainingTasks = tasksArray.slice(1);

      logicObj.apiCall(url,function(error,data) {
        task(error,data);
        logicObj.waterfall(remainingUrls, remainingTasks, req, res);
      })


    } else {
      const stringifyData = JSON.stringify(logicObj.resultsObj);
      var status = 200
      if (logicObj.resultsObj.character.name === 'Not found') {
        status=404
      }

      res.writeHead(status, 'Content-Type: application/json');
      res.end(stringifyData);
    }
  },


  init: function(req, res) {

    logicObj.waterfall([logicObj.makeCharacterUrl, logicObj.makeComicUrl], [logicObj.characterProfile, logicObj.comicProfile], req, res);
  }

}


module.exports = logicObj;
