const axios = require('axios').default;
var YourApiKeyToken = 'TVQ7CXSAVS8VYXHC84PGFA3I8A618IMQYQ';
var celebrityList = [
    ['Ethereum Foundation', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'],
    ['Vitalik',	'0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'],
    ['Jack Dorsey', '0x925eD2034a30D54333beaB3593956bc0E6fC9C62'],
    ['Mark Cuban', '0xa679c6154b8d4619Af9F83f0bF9a13A680e01eCf'],
    ['Beeple', '0xc6b0562605D35eE710138402B878ffe6F2E23807'],
    ['Steph Curry', '0x3becf83939f34311b6bee143197872d877501b11'],
    ["Shaquille O’Neal", '0x3C6aEFF92b4B35C2e1b196B57d0f8FFB56884A17'],
    ['Neymar Jr', '0xC4505dB8CC490767fA6f4b6f0F2bDd668B357A5D'],
    ['Snoop Dogg', '0xCe90a7949bb78892F159F428D0dC23a8E3584d75'],
    ['JustinBieberNFTS', '0xE21DC18513e3e68a52F9fcDaCfD56948d43a11c6'],
    ['Machi 大哥', '0x020cA66C30beC2c4Fe3861a94E4DB4A498A35872'],
    ['周杰倫', '0x1087f515f7FaAE8B35045e91092ea8878B757849'],
    ['林俊傑', '0x225558706370bef1760c52e76a07be9c104c98aa'],
    ['黃明志', '0xd3a3fB18e1ba3770918636A57F1E605924C23C7B']
];
const d = new Date();
var blockIndex;

async function fetchTransactions(celebrityList) {
    // Address of contract of interest
    console.log(`Fetching recent Txs of ${celebrityList[0][0]}, ${celebrityList[1][0]}, ${celebrityList[2][0]} and some other celebrities.`);
    let time = Math.round(d.getTime() / 1000 - 3);
    //console.log(time);
    //let blockIndex = Number(getBlock(time));
    //console.log('getblock return ' +getBlock(time));
    await getBlock(time);
    //console.log(`bstart=${blockIndex}`);

    for (let i = 0; i < celebrityList.length; i++) {
        let URL1 = `https://api.etherscan.io/api?module=account&action=txlist&address=${celebrityList[i][1]}&startblock=${blockIndex - 40000}&endblock=${blockIndex}&sort=desc&apikey=${YourApiKeyToken}`;

        //console.log(celebrityList.length);
        await axios.get(URL1)
        .then((response) => {
            //console.log('num of results is ' + response.data.result.length);
            let results = response.data.result;
            for (let j = 0; j < results.length; j++) {
                if (Number(results[j].value) >= 10 * (10 ** 18)) {
                    console.log('Address ' + results[j].from + ' has sent ' + results[j].value / (10 ** 18) + ' ETH to Address ' + results[j].to + '.\n' + celebrityList[i][1] + ' is ' + celebrityList[i][0] + "'s account.\n")
                    //if (results[i].from)
                }
            }
        })
        .catch(function (error) {
            //console.log(error);
            if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });


        let URL2 = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${celebrityList[i][1]}&startblock=${blockIndex - 40000}&endblock=${blockIndex}&sort=desc&apikey=${YourApiKeyToken}`;

        await axios.get(URL2)
        .then((response) => {
            //console.log('num of results is ' + response.data.result.length);
            //console.log(response.data.result);
            let results = response.data.result;
            //console.log(results);
            for (let j = 0; j < results.length; j++) {
                if (Number(results[j].value) >= 10 * (10 ** 18)) {
                    console.log('Address ' + results[j].from + ' has sent ' + results[j].value / (10 ** 18) + ' ETH to Address ' + results[j].to + '.\n' + celebrityList[i][1] + ' is ' + celebrityList[i][0] + "'s account.\n")
                    //if (results[i].from)
                }
            }
        })
        .catch(function (error) {
            if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
    }
}

async function getBlock(time) {
    let URLtime = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${time}&closest=before&apikey=${YourApiKeyToken}`

    await axios.get(URLtime)
        .then((response) => {
            //console.log(response.data.result);
            blockIndex = response.data.result;
            })
        .catch(function (error) {
            if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
        });
}


fetchTransactions(celebrityList);
    

    


    // https://etherscan.io/apis#accounts
    /*
    console.log(`bstart=${blockIndex - 50}`)
    const URL2 = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${proxyAddr}&startblock=${blockIndex - 50}&endblock=${blockIndex - 1}&sort=asc&apikey=${apiKey}`

    console.log("hello1");
    await axios.get(URL2)
        .then((response) => {checkMinting(response.data.result)})
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
    console.log("hello2");
    */
    // console.log(response.data.status);
    // console.log(response.data.message);

    //const data = await response;
    //return data;