const axios = require('axios').default;
const apiKey = 'TVQ7CXSAVS8VYXHC84PGFA3I8A618IMQYQ'
const d = new Date();


async function fetchMinting(startBlock, endBlock) {
    // Address of contract of interest
    const proxyAddr = `0x0000000000000000000000000000000000000000`;
    //console.log(`Fetching Txs For ${proxyAddr} for blocks: ${startBlock}-${endBlock}`);
    let time = Math.round(d.getTime() / 1000 - 3);
    let blockIndex;
    //console.log(time)
    const URL1 = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${time}&closest=before&apikey=YourApiKeyToken`

    await axios.get(URL1)
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


    // https://etherscan.io/apis#accounts
    //console.log(typeof(bloclIndex));
    //console.log(`bstart=${blockIndex - 50}`);
    const URL2 = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${proxyAddr}&startblock=${blockIndex - 50}&endblock=${blockIndex - 1}&sort=asc&apikey=${apiKey}`

    //console.log("hello1");
    await axios.get(URL2)
        .then((response) => {checkMinting(response.data.result)})
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
    //console.log("hello2");
    // console.log(response.data.status);
    // console.log(response.data.message);

    //const data = await response;
    //return data;
}

async function checkMinting(results) {
    var done = new Array(results.length);
    for (let i = 0; i < results.length; i++) {
        if (done[i] != 1 && results[i].from == '0x0000000000000000000000000000000000000000') {
            done[i] = 1
            let count = 1;
            for (let t = i + 1; t < results.length; t++) {
                if (results[t].contractAddress == results[i].contractAddress) {
                    count++;
                    done[t] = 1;
                }
            }
            if (count >= 30) {
                console.log(results[i].tokenName + ' have been minted ' + count + ' times in the last 10 minutes.');
                console.log('The contact address of ' + results[i].tokenName + ' is ' + results[i].contractAddress);
                console.log('The URL is https://opensea.io/assets/' + results[i].contractAddress + '/1');
                
                const URL3 = `https://api.opensea.io/api/v1/collections?asset_owner=${results[i].to}&offset=0&limit=300`;
                await axios.get(URL3)
                    .then((response) => {
                        if (response.data.collections)
                            printCollection(response.data.collections);
                        //else if (response.data.name)
                        //    console.log(response.data.name + ' has been minted ' + count + ' times in the last 10 minutes.')
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
    }
}

function printCollection(collections) {
    //console.log('The ' + collection.name + ' collection has been minted for ' + count + ' times in the last 10 minutes')
    //console.log('URL: https://opensea.io/collection/' + collection.slug)
}

fetchMinting(0, 10000000);
//const data = fetchMinting(0, 10000000);

//console.log(data);

/*
async function bot() {
    // Going to retrieve txs for last 30 days
    const dateNow: any = moment();
    const dateStart: any = dateNow.clone().subtract(30, 'days');

    // Use api to get block numbers for timestamps
    let startBlock = Number(await getBlockForTime(dateStart.unix()));
    let endBlock = Number(await getBlockForTime(dateNow.unix()));
    console.log(`Start: ${dateStart.format()} ${startBlock}`);
    console.log(`End: ${dateNow.format()} ${endBlock}`);

    let txs: any[] = [];
    // Retrieve all txs in range (for max amt) using API
    while(startBlock < endBlock){
        let endRange = startBlock + 15000;
        let txsRange = await fetchTransactions(startBlock, endRange);
        console.log(`No of txs: ${txsRange.length}`);
        txs = txs.concat(txsRange);
        startBlock = endRange + 1;
    }

    console.log(`Total: ${txs.length} transactions in period`);

    let totalGas = Decimal(0);
    let totalGasPrice = Decimal(0);
    let totalCostEth = Decimal(0);
    let gasPriceDist = {};
    // For each tx -
    // Out gasUsed, gasPrice and ethCost (=gasPrice * gasUsed)
    // sum gasUsed for avg
    // sum gasPrice for avg
    // sum ethCost for avg
    // Create hash table of gasPrice distribution
    txs.forEach(tx => {
        let gasUsed = Decimal(tx.gasUsed);
        totalGas = totalGas.plus(gasUsed);
        let gasPrice = Decimal(tx.gasPrice);
        totalGasPrice = totalGasPrice.plus(gasPrice);
        let ethCost = gasPrice.mul(gasUsed);
        totalCostEth = totalCostEth.plus(ethCost);
        console.log(`GasUsed: ${gasUsed}, GasPrice: ${gasPrice}, Eth Cost: ${ethCost}`);
        if(! gasPriceDist[tx.gasPrice])
          gasPriceDist[tx.gasPrice] = 1;
        else
          gasPriceDist[tx.gasPrice] += 1;
    });
    
    // Output results
    console.log(gasPriceDist);
    let avgGasPrice = totalGasPrice.div(txs.length);
    console.log(`Total Gas Used: ${totalGas.toString()}`);
    console.log(`Total Eth: ${totalCostEth.div(BONE).toString()}`);
    console.log(`Average Gas Price: ${avgGasPrice.toString()}`);
    // console.log(txs[txs.length-1]);
}
*/