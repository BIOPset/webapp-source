import axios from "axios";


export async function currentEthPriceInUSD() {


    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');

    return data.ethereum.usd;
}

export async function ethPriceDataInUsd(days: number, interval: string) {
    const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}&interval=${interval}`);

    // tslint:disable-next-line:no-console
    console.log("axios retrb");
    // tslint:disable-next-line:no-console
    console.log(data);
    return  data.prices;
}