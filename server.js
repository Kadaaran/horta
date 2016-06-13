var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrap', function(req, res){

  url = 'https://jardinage.ooreka.fr/plante/voir/2/framboisier';

  // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        if(!error && response.statusCode == 200){

            var $ = cheerio.load(html);

            var title, release, rating;
            var json = {
              name : "",
              release : "",
              rating : ""
            };

            $('.w_1_2.parties_plantes').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.
                var data = $(this);
                // console.log(this, 'this data from .header');
                name = data.children().text;
                json.name = name;
                console.log(json.name);
                return json.name;
           // In examining the DOM we notice that the title rests within the first child element of the header tag.
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:
                // title = data.children().first().text();
                // release = data.children().last().children().text();
                //
                // json.title = title;
                // json.release = release;

            })

                // $('.ratingValue').filter(function(){
                // var data = $(this);
                // console.log(this, 'this data from .star-box-giga-star');

                // The .star-box-giga-star class was exactly where we wanted it to be.
                // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further

                // rating = data.text();
                //
                // json.rating = rating;
                // })

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
