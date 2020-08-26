import Redis from "ioredis"
import st from 'stocktwits';
import {yahoo} from "./yahoo-service.js";
import {getUpgrade} from "./infodarastacks.js";

const TWITTER_CONST = "twitter"
let r = new Redis({
    port: 17960, // Redis port
    host: "redis-17960.c1.eu-west-1-3.ec2.cloud.redislabs.com", // Redis host
    password: "lHW3MHce7ZHP0mFEUhWbW99eaOcW9hd7",
})

async function main() {
    await r.set("lefet", "asd");
    let lefet = await r.get("lefet");
    // await r.del("lefet");
    console.log(lefet);
    r.disconnect();
}

async function sub() {
    r.subscribe("chan1", "chan2", function (err, count) {
        // Now we are subscribed to both the 'chan1' and 'chan2' channels.
        // `count` represents the number of channels we are currently subscribed to.
        console.log("Subscribt")
    });

    r.on("message", function (channel, message) {
        // Receive message Hello world! from channel news
        // Receive message Hello again! from channel music
        console.log("Receive message %s from channel %s", message, channel);
    });
}

async function pub() {
    await r.publish("chan1", "Hello world!");
    await r.publish("chan2", "Hello again!");
}

let messages = [];

async function readTweetsPlease(stock) {
    await r.publish("posts_ready", JSON.stringify({
        stock: stock,
        source: TWITTER_CONST,
    }));

    // st.get(`streams/symbol/${stock}`, {limit: 30}, async (err, res) => {
    //     let messages = res.body.messages.map(msg => ({
    //         message: msg.body,
    //         time: msg.created_at,
    //         username: msg.user.username,
    //         avatarUrl: msg.user.avatar_url,
    //         sentiment: msg.entities.sentiment ? msg.entities.sentiment.basic : null,
    //     }));
    //     console.log("Got messages", messages.length);
    //
    //     await r.set(`data_${stock}_${TWITTER_CONST}`, JSON.stringify(messages));
    //     await r.publish("posts_ready", JSON.stringify({
    //         stock: stock,
    //         source: TWITTER_CONST,
    //     }));
    // });
}

function readTwits() {
    setInterval(async () => {
        let stocksWatchlist = await r.get("watchlist");
        if (stocksWatchlist == null) {
            stocksWatchlist = []
            await r.set("watchlist", JSON.stringify({}))
        } else {
            stocksWatchlist = JSON.parse(stocksWatchlist);
        }

        for (let stock of Object.values(stocksWatchlist)) {
            if (stock.subscribers > 0) {
                readTweetsPlease(stock.name);

                console.log("Starting yahook")
                // YAHOO
                let yahooDatas = await yahoo();
                await r.set(`data_${stock.name}_yahoo`, JSON.stringify(yahooDatas));
                await r.publish("posts_ready", JSON.stringify({
                    stock: stock.name,
                    source: "yahoo",
                }));

                console.log("Starting finviz")
                // Finviziziz
                let finfvizez = await getUpgrade()
                await r.set(`data_${stock.name}_finviz`, JSON.stringify(finfvizez));
                await r.publish("posts_ready", JSON.stringify({
                    stock: stock.name,
                    source: "finviz",
                }));
            }
        }
    }, 10000)
}

readTwits()
// stocktwits("NIO");
// pub()
// sub();
// main()
