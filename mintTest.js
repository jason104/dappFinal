//const axios = require('axios').default;
const apiKey = 'TVQ7CXSAVS8VYXHC84PGFA3I8A618IMQYQ'
const d = new Date();


async function fetchMinting() {
    //In order to check minting event, we check ERC721 token transfer event from address 0.
    const proxyAddr = `0x0000000000000000000000000000000000000000`;
    //Get current time
    let time = Math.round(d.getTime() / 1000 - 3);
    let blockIndex;
    document.write(time);
    const URL1 = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${time}&closest=before&apikey=${apiKey}`;

    await axios.get(URL1)
        .then((response) => {
            //Get current block index
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
    const URL2 = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${proxyAddr}&startblock=${blockIndex - 50}&endblock=${blockIndex - 1}&sort=asc&apikey=${apiKey}`;

    //Get all the minting event in the last 11 mins.
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
    // done[i]==1, the person(results[i].to) has been checked, no need to check again
    var done = new Array(results.length);
    for (let i = 0; i < results.length; i++) {
        if (done[i] != 1 && results[i].from == '0x0000000000000000000000000000000000000000') {
            done[i] = 1
            let count = 1;
            //Check the whole result list to calculate the number of minting event from the same person(results[i].to).
            for (let t = i + 1; t < results.length; t++) {
                if (results[t].contractAddress == results[i].contractAddress) {
                    count++;
                    done[t] = 1;
                }
            }
            //If the same person minted NFT more than 30 times in the past 10 minutes, we print alert.
            if (count >= 30) {
                document.write(results[i].tokenName + ' have been minted ' + count + ' times in the last 10 minutes.');
                document.write('The contact address of ' + results[i].tokenName + ' is ' + results[i].contractAddress);
                document.write('The URL is https://opensea.io/assets/' + results[i].contractAddress + '/1');
                
            }
        }
    }
}


console.log('123');
fetchMinting();



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