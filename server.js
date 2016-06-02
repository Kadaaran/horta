var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrap', function(req, res){

  //All the web scraping magic will happen here
  //change to plan url or whatever
  url = 'http://www.imdb.com/title/tt1229340/';

  // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
        if(!error && response.statusCode == 200){

            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            var title, release, rating;
            var json = {
              title : "",
              release : "",
              rating : ""
            };

            $('.title_wrapper').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.
                var data = $(this);
                console.log(this, 'this data from .header');

           // In examining the DOM we notice that the title rests within the first child element of the header tag.
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:
                title = data.children().first().text();
                release = data.children().last().children().text();
           // Once we have our title, we'll store it to the our json object.
                json.title = title;
                json.release = release;

            })

                $('.ratingValue').filter(function(){
                var data = $(this);
                console.log(this, 'this data from .star-box-giga-star');

                // The .star-box-giga-star class was exactly where we wanted it to be.
                // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further

                rating = data.text();

                json.rating = rating;
                })

            fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
            console.log('File successfully written! - Check your project directory for the output.json file');

            // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            res.send('Check your console!')
            });
        }
        else {
          console.log('We got errors ! ON FIRE !');
        }
    })
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
