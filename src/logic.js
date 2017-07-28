const handlers = require('./handlers');
const request = require('request');
const crypto = require('crypto');
const env = require('env2')('.env');
const https = require('https');

const API_URL = "https://gateway.marvel.com/v1/public"

const logicObj = {

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
      console.log('makeCharacterUrl has run');
      return url;
    },

    //change this
    makeComicUrl: function() {
      const ts = Date.now()
      const hash = crypto.createHash('md5').update(ts + process.env.PRIV_KEY + process.env.API_KEY).digest('hex')
      const characterId = logicObj.resultsObj.character.id
      const url = `${API_URL}/characters/${characterId}/comics?orderBy=-onsaleDate&apikey=${process.env.API_KEY}&ts=${ts}&hash=${hash}`
      console.log('makeComicUrl has run');
      return url;
    },

    apiCall: function(url, cb) {
      console.log("api call has started");
      request(url, function(error, response, body) {
        // console.log('request started');
        // response.setEncoding('UTF-8');
        // let rawData = '';
        // response.on('data', (chunk) => {
        //   rawData += chunk;
        // });
        // response.on('error', (e) => {
        //   cb(e)
        // })
        // response.on('end', () => {
        //   cb(null, rawData)

        if (error) {
          cb(error);
        } else {
          cb(null,body);
        }
        // })
      })
    },

    characterProfile: function(error, data) {
      console.log('characterProfile has started');

      if (error) {
        console.log('characterProfile has run - error');
        logicObj.resultsObj.character.id = 1;
        logicObj.resultsObj.character.name = 'Not found';
        logicObj.resultsObj.character.description = 'Please try another one';
        logicObj.resultsObj.character.image = 'https://media.giphy.com/media/nKN7E76a27Uek/giphy.gif';
        return
      }
      console.log("im here")
      console.log("im data: ", JSON.parse(data).data.results)


      const parsed = JSON.parse(data);

      const emptyResults = parsed.data.results

      const results = parsed.data.results[0];

      if (emptyResults.length === 0) {
        logicObj.resultsObj.character.id = 1;
        logicObj.resultsObj.character.name = 'Not found';
        logicObj.resultsObj.character.description = 'Please try another one';
        logicObj.resultsObj.character.image = 'https://media.giphy.com/media/nKN7E76a27Uek/giphy.gif';
        console.log('characterProfile has run - no results');
        return
      }

      logicObj.resultsObj.character.id = results.id;
      console.log('LOGIC THING' , logicObj.resultsObj.character);
      logicObj.resultsObj.character.name = results.name;
      logicObj.resultsObj.character.description = results.description;
      logicObj.resultsObj.character.image = results.thumbnail.path + '.' + results.thumbnail.extension;
      console.log('characterProfile has run - results');
      return


    },


    comicProfile: function(error, data) {
    console.log('comicProfile has started')
      if (error) {
        return
      }
console.log("comicProfile: im here")
      const parsed = JSON.parse(data)
      console.log("im comic parsed: ", parsed.data.results)
      const results = parsed.data.results[0]
      const emptyComicResults = parsed.data.results


      if (emptyComicResults.length === 0) {
        console.log('comicProfile has run - error');
        return
      }

      logicObj.resultsObj.comic.date = results.dates[0].date;
      logicObj.resultsObj.comic.name = results.title;
      logicObj.resultsObj.comic.description = results.description;
      logicObj.resultsObj.comic.image = results.thumbnail.path + '.' + results.thumbnail.extension;
      console.log('comicProfile has run - with results');
      console.log('resultsObj:', logicObj.resultsObj)
      return


  },

    // sendResponse: function (results){
    //   const stringifyData = JSON.stringify(results) ;
    //   res.writeHead(200,'Content-Type: application/json');
    //   res.end(stringifyData);
    // },

    waterfall: function(urlsArray, tasksArray, req, res) {
    if (tasksArray.length > 0) {

      console.log('a waterfall round has started');
      var url = urlsArray[0](req);
      var remainingUrls = urlsArray.slice(1);
      var task = tasksArray[0];
      var remainingTasks = tasksArray.slice(1);

      console.log('a waterfall round has ended');

      logicObj.apiCall(url,function(error,data) {
        task(error,data);
        logicObj.waterfall(remainingUrls, remainingTasks, req, res);
      })

      // if this doesn't work, try 103 as a callback in the task array tasks

    } else {
      // logicObj.sendResponse(logicObj.resultsObj);
      console.log('the waterfall else case has called')
      console.log("what is my name: ", logicObj.resultsObj.character.name)
      const stringifyData = JSON.stringify(logicObj.resultsObj);

      var status = 200
      if (logicObj.resultsObj.character.name === 'Not found') {
        console.log("Do i reach this place?")
        status=404
      }

      res.writeHead(status, 'Content-Type: application/json');
      console.log("what is my status ", status)
      res.end(stringifyData);
      console.log("what do i send ", stringifyData)
    }
  },

    // init: function(req, res) {
    //
    //     logicObj.waterfall( [logicObj.makeCharacterUrl(req), logicObj.makeComicUrl()], [logicObj.characterProfile, logicObj.comicProfile], logicObj.sendResponse);
    // }

    init: function(req, res) {
      logicObj.waterfall([logicObj.makeCharacterUrl, logicObj.makeComicUrl], [logicObj.characterProfile, logicObj.comicProfile], req, res);
    }

}


module.exports = logicObj;
