var Twit = require("twit");

const bot = new Twit({
   consumer_key: 'x',
   consumer_secret: 'x',
   access_token: 'x',
   access_token_secret: 'x',
   timeout_ms: 60 * 1000
});
function tweet(postTweet) {
    // Cuidado ao postar tweets repetidos   
    bot.post(
        'statuses/update',
        {status: postTweet},
        function (err, data, response) {
            if (err) {
                console.log("ERRO:" + err);
                return false;
            }
            console.log("Tweet postado com sucesso!\n");
        }
    )
}

module.exports = {tweet};