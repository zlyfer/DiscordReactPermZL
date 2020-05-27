// jshint esversion: 9
if (process.platform != "win32") process.chdir("/home/zlyfer/DiscordBots/DiscordReactPermZL");

const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const token = require("./token.json");
const guilds = require("./guilds.json");

client.on("ready", () => {
  console.log("online");
  guilds.guilds.forEach((g) => {
    let guild = client.guilds.resolve(g.id);
    if (guild) {
      let channel = guild.channels.resolve(g.channel);
      if (channel)
        channel.fetch().then((fetchedChannel) => {
          fetchedChannel.messages.fetch(g.message).then((fetchedMessage) => {
            const filter = (reaction) => reaction.emoji.name === g.reaction;
            setInterval(() => {
              fetchedMessage
                .awaitReactions(filter, { time: 1000 })
                .then((collected) => {
                  collected.forEach((reaction) => {
                    reaction.users.cache.array().forEach((user) => {
                      guild.members
                        .fetch(user.id)
                        .then((member) => {
                          member.roles.add(g.role, g.reason).then().catch(console.error);
                        })
                        .catch(console.warn);
                    });
                  });
                })
                .catch(console.warn);
            }, 1000);
          });
        });
    }
  });
});

client.on("guildCreate", (guild) => {
  if (!guilds.guilds.find((g) => g.id == guild.id)) {
    let g = {
      id: guild.id,
      channel: "",
      message: "",
      reaction: "✅",
      role: "",
      reason: "Accepted the rules.",
    };
    guilds.guilds.push(g);
    saveGuilds();
    // TODO: Restart bot.
  }
});

function saveGuilds() {
  fs.writeFileSync("./guilds.json", JSON.stringify(guilds));
}

client.login(token.token);
