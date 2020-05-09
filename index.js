// jshint esversion: 9
if (process.platform != "win32") process.chdir("/home/zlyfer/DiscordBots/DiscordReactPermZL");

const Discord = require("discord.js");
const client = new Discord.Client();
const token = require("./token.json");

client.on("ready", () => {
  console.log("online");
  let guild = client.guilds.resolve("706866765514407990");
  if (guild) {
    let channel = guild.channels.resolve("706866765984170078");
    if (channel)
      channel.fetch().then((fetchedChannel) => {
        fetchedChannel.messages.fetch("708762414182826004").then((fetchedMessage) => {
          const filter = (reaction) => reaction.emoji.name === "👍";
          setInterval(() => {
            fetchedMessage
              .awaitReactions(filter, { time: 1000 })
              .then((collected) => {
                collected.forEach((reaction) => {
                  reaction.users.cache.array().forEach((user) => {
                    guild.members.fetch(user.id).then((member) => {
                      member.roles.add("706866975627804704", "Accepted rules.").then().catch(console.error);
                    });
                  });
                });
              })
              .catch(console.error);
          }, 1000);
        });
      });
  }
});

client.login(token.token);
