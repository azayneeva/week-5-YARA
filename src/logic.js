const handlers = require('./handlers');
const request = require('./request');

const env = require('env2')('.env');


const API_URL = "https://gateway.marvel.com/v1/public"


var logicObj = {

  resultsObj: {},


  makeCharacterUrl: function() {
    const queryName = req.url.replace('/search/','')
    const ts = Date.now()
    const hash = crypto.createHash('md5').update(ts + process.env.PRIV_KEY + process.env.API_KEY).digest('hex')
    const url = `${API_URL}/characters?name=${queryName}&apikey=${process.env.API_KEY}&ts=${ts}&hash=${hash}`
    return url;
  },

  //change this
  makeComicUrl: function() {
    var urlStart = 'https://api.tfl.gov.uk/Line/';
    var urlEnd = '/Status?app_id=de9e1a2e&app_key=41bcfcc2d033bae16403b619c8ec1613';
    return urlStart + logicObj.resultsObj.line + urlEnd;
  },



  characterProfile: function(url) {
    request(url, function(err, response, body) {
      if (err) {
        logicObj.resultsObj.character.id = 1;
        logicObj.resultsObj.character.name = 'Not found';
        logicObj.resultsObj.character.description = 'Please try another one' ;
        logicObj.resultsObj.character.image = 'https://media.giphy.com/media/nKN7E76a27Uek/giphy.gif';
        return
      }
      const parsed = JSON.parse(body)
      const results = parsed.data.results[0]
      console.log("Im parsed data", results)

      if (!results.length) {
        logicObj.resultsObj.character.id = 1;
        logicObj.resultsObj.character.name = 'Not found';
        logicObj.resultsObj.character.description = 'Please try another one' ;
        logicObj.resultsObj.character.image = 'https://media.giphy.com/media/nKN7E76a27Uek/giphy.gif';
        return
      }

      logicObj.resultsObj.character.id = results.id;
      logicObj.resultsObj.character.name = results.name;
      logicObj.resultsObj.character.description = results.description ;
      logicObj.resultsObj.character.image = results.thumbnail.path + '.' + results.thumbnail.extension;
      return

    })
  },

  comicProfile: function(giphyData) {
    var randomNum = Math.floor(Math.random()*30);
    var gifSrc = giphyData.data[randomNum].images.fixed_height.url;
    logicObj.resultsObj.url = gifSrc;
  },

  sendResponse(resultsObj){
//write a function
  };

  waterfall: function(urlsArray,tasksArray, sendResponse) {
      if (tasksArray.length > 0) {

          var url = urlsArray[0]();
          var remainingUrls = urlsArray.slice(1);
          var task = tasksArray[0];
          var remainingTasks = tasksArray.slice(1);


          logicObj.apiCall(url, function(data) {
              task(data);
              logicObj.waterfall( remainingUrls,remainingTasks, sendResponse);
          })

      }
      else {
          logicObj.sendResponse(logicObj.resultsObj);
      }
  },

  init: function(req, res) {

      logicObj.waterfall( [logicObj.characterUrl, logicObj.comicUrl], [logicObj.getCharacter, logicObj.getComic], logicObj.sendResponse);
  }

}


  module.exports=logicObj;
