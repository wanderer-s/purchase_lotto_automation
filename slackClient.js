import { WebClient} from '@slack/web-api';
import "dotenv/config"
const token = process.env.SLACK_TOKEN
const channel = process.env.SLACK_CHANNEL
const slackBot = new WebClient(token)

async function sendMessage(message) {
  try {
    await slackBot.chat.postMessage({
      channel,
      text: message
    })
  } catch (error) {
    console.log(error)
  }
}

export { sendMessage }