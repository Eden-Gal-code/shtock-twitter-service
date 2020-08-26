import Redis from "ioredis"


let r = new Redis({
    port: 17960, // Redis port
    host: "redis-17960.c1.eu-west-1-3.ec2.cloud.redislabs.com", // Redis host
    password: "lHW3MHce7ZHP0mFEUhWbW99eaOcW9hd7",
})

async function main() {
    await r.set("lefet", "asd");
    let lefet = await r.get("lefet");
    await r.del("lefet");
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
    r.publish("chan1", "Hello world!");
    r.publish("chan2", "Hello again!");
}

pub()
// sub();
// main()
