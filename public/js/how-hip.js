      (function() {

        var stateKey = 'spotify_auth_state';

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }

        /**
         * Generates a random string containing numbers and letters
         * @param  {number} length The length of the string
         * @return {string} The generated string
         */
        function generateRandomString(length) {
          var text = '';
          var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

          for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
        };

        function titleCase(str) {
             str = str.toLowerCase().split(' ');                // will split the string delimited by space into an array of words

             for(var i = 0; i < str.length; i++){               // str.length holds the number of occurrences of the array...
                  str[i] = str[i].split('');                    // splits the array occurrence into an array of letters
                  str[i][0] = str[i][0].toUpperCase();          // converts the first occurrence of the array to uppercase
                  str[i] = str[i].join('');                     // converts the array of letters back into a word.
             }
             return str.join(' ');                              //  converts the array of words back to a sentence.
        }

//creates table with user's top artists, creates hipscore meter
        function drawTable(data) {
          for (var i = 0; i < data.length; i++) {
            var tcounter = 0;
            popularitySum += parseInt(data[i].popularity);
            followersSum += parseInt(data[i].followers.total);
            tcounter = i + 1;
            drawRow(data[i], tcounter);
          }
          popularityAvg = (100 - (popularitySum / data.length)).toFixed(2);
          $(".media-body h1").text("Your hipscore is " + popularityAvg + "!");



        var g = new JustGage({
                id: "hip-gauge",
                value: popularityAvg,
                valueFontColor: "#4d4d4d",
                min: 0,
                minTxt: "Basic",
                max: 100,
                maxTxt: "Hipster",
                label: "",
                gaugeWidthScale: 0.2,
                relativeGaugeSize: true,
                valueFontFamily: "Roboto Slab",
                levelColors: [
                  "#fa4133",
                  "#fdbe37",
                  "#1cb42f"
                ],
                pointer: true,
                pointerOptions: {
                  color: '#696969'
                },
                decimals: 2,
                counter: true,
                noGradient: false,
                labelFontColor: "#696969",
                valueFontColor: "#696969",
                minLabelMinFontSize: 11,
                maxLabelMinFontSize: 11,
                valueMinFontSize: 14,
                customSectors: {
                ranges: [{
                  color : "#fa4133",
                  lo : 0,
                  hi : 33
                },{
                  color : "#fdbe37",
                  lo : 34,
                  hi : 67
                },{
                  color : "#1cb42f",
                  lo : 68,
                  hi : 100
                }]
              }
              });

        }


        function drawRow(rowData, counter) {
            var rawHipscore = 100 - parseInt(rowData.popularity);
            var genresClean = rowData.genres.toString().replace(/,/g , ", ");
            var titlegenres = '';
            try {
              titlegenres = titleCase(genresClean).replace(/\&b/g, "&B");
            } catch(err) {
              setTimeout(function(){
                  titlegenres = titleCase(genresClean).replace(/\&b/g, "&B");
              }, 2000);
            } finally {
              if (titlegenres == '') {
                titlegenres = genresClean;
              }
            }
        
            var followersCommas = rowData.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var row = $("<tr />")
            $("#artist-info-table").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
            row.append($('<td> <img class="media-object" width="50" src="' + rowData.images[0].url + '"/></td>'));
            row.append($("<td>" + rowData.name + "</td>"));
            row.append($("<td>" + counter + "</td>"));
            row.append($("<td>" + rawHipscore+ "</td>"));
            row.append($("<td>" + followersCommas + "</td>"));
            row.append($("<td>" + titlegenres + "</td>"));
        }

        var popularityAvg = 0,
            popularitySum = 0,
            followersSum = 0;


        var userProfileSource = document.getElementById('user-profile-template').innerHTML,
            userProfileTemplate = Handlebars.compile(userProfileSource),
            userProfilePlaceholder = document.getElementById('user-profile');


            oauthSource = document.getElementById('oauth-template').innerHTML,
            oauthTemplate = Handlebars.compile(oauthSource),
            oauthPlaceholder = document.getElementById('oauth');

        var params = getHashParams();

        var access_token = params.access_token,
            state = params.state,
            storedState = localStorage.getItem(stateKey);

        if (access_token && (state == null || state !== storedState)) {
          // alert('There was an error during the authentication');
          window.location.href = "/";
        } else {
          localStorage.removeItem(stateKey);
          if (access_token) {
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                  $('#login').hide();
                  $('#loggedin').show();
                }
            });

            $.ajax({
                url: 'https://api.spotify.com/v1/me/top/artists',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {

                //countdown
                var hipMeter = document.getElementsByClassName("thumbnail");
                var counter = 3;
                hipMeter.innerHTML = "3";
                var id;
                id = setInterval(function() {
                    counter--;
                    if(counter < 0) {
                        $(hipMeter).hide();
                        //make meter, table
                        $(".table-responsive").removeAttr("style");
                        drawTable(response.items);
                        $("#table-title").removeAttr("style");
                        $("#footnote").removeAttr("style");
                        $("footer").removeAttr("style");
                        $("tspan").css("font-family", "Roboto Slab");
                        clearInterval(id);
                    } else if (counter == 0) {
                        if ($(".caption")) {
                          $(".caption div").text("Hip!");
                        } else{
                          $(".countdown-no-image").text("Hip!");
                        }
                    } else {
                        if ($(".caption")) {
                          $(".caption div").text(counter.toString());
                        } else {
                          $(".countdown-no-image").text(counter.toString());
                        }
                        
                    }
                }, 1000);
                }
            });
            

          } else {
              $('#login').show();
              $('#loggedin').hide();
          }

          document.getElementById('login-button').addEventListener('click', function() {

            var client_id = '7977c20b20f24edf83821a4a73cc2dd7'; // Your client id
            var redirect_uri = 'http://localhost:8080'; // Your redirect uri
            //var redirect_uri = 'http://www.how-hip-are-you.com'
            //var redirect_uri = 'https://how-hip-are-you.herokuapp.com'

            var state = generateRandomString(16);

            localStorage.setItem(stateKey, state);
            var scope = 'user-read-private user-read-email user-top-read';

            var url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=token';
            url += '&client_id=' + encodeURIComponent(client_id);
            url += '&scope=' + encodeURIComponent(scope);
            url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
            url += '&state=' + encodeURIComponent(state);

            window.location = url;
          }, false);
        }
      })();
    $(".text-muted").append("By c0Ri3 | " + new Date().getFullYear() + " | <a href='mailto:hip.contact@how-hip-are-you.com' class='footer-link'>Contact</a>");