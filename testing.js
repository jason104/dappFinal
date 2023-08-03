const axios = require('axios').default;



var URL = 'https://api.opensea.io/api/v1/collection/killabears';
async function bbb() {
    await axios.get(URL)
        .then((response) => {
            let result = response.data.collection;
            console.log(result.description);
        })
        .catch(function (error) {
            //console.log(error);
            if (error.response) {
                console.log('shiiit');
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
}

bbb();