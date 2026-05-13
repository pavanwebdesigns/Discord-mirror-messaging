const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

const SOURCE_SERVER_ID = '838331560225669120'; 
const MY_GENERAL_CHANNEL_ID = '1501346550524149913'; 

client.once('ready', () => {
    console.log(`✅ Success! Logged in as ${client.user.tag}`);
    console.log("Listening for messages across all servers...");
});

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;


    if (message.guildId === SOURCE_SERVER_ID) {
        
        console.log(`📩 Mirroring message from ${message.author.username} in ${message.guild.name}`);

        try {
            const destChannel = await client.channels.fetch(MY_GENERAL_CHANNEL_ID);
            if (destChannel) {
                await destChannel.send({
                    content: `**[From: ${message.author.username}]**: ${message.content}`
                });
                console.log("📤 Mirrored to your General server!");
            }
        } catch (err) {
            console.error("❌ Failed to send to General server:", err.message);
        }


        const n8nUrl = 'http://localhost:5678/webhook-test/discord-data';
        try {
            await axios.post(n8nUrl, {
                user: message.author.username,
                text: message.content,
                server: message.guild.name,
                time: new Date().toLocaleString()
            });
            console.log("🚀 Also sent to n8n!");
        } catch (error) {
            console.error("❌ Error sending to n8n:", error.message);
        }
    }
});

client.login('token here');