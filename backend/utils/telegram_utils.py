# backend/utils/telegram_utils.py

from telegram import Bot
import asyncio
import os
import sys

# Cross-folder import for voice confirmation
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../voice_bot")))
from voice_bot.voice_bot_hindi import speak_hindi

# Replace with your actual Telegram Bot Token and Chat ID
TELEGRAM_BOT_TOKEN = '8461033646:AAHrxcY7MuvTBlIfo2AK2CfMUUviSv7H2OA'
TELEGRAM_CHAT_ID = '7141697152'

# 🔗 Adjust this to match your frontend's tracking page
TRACKING_BASE_URL = "http://localhost:3000/track"  # or your deployed React app URL

async def _send_message_async(data, complaint_id):
    bot = Bot(token=TELEGRAM_BOT_TOKEN)

    tracking_link = f"{TRACKING_BASE_URL}/{complaint_id}"

    message = f"""📢 *आपकी शिकायत सफलतापूर्वक दर्ज की गई है!*

🆔 *शिकायत ID:* `{complaint_id}`

📝 *शिकायत:* {data.get('शिकायत')}
👤 *शिकायतकर्ता:* {data.get('शिकायतकर्ता का नाम')}
📍 *स्थान:* {data.get('स्थान')}
📞 *मोबाइल:* {data.get('मोबाइल नंबर')}

🔍 *स्थिति देखने के लिए ट्रैक करें:* [यहाँ क्लिक करें]({tracking_link})

🙏 हम जल्द ही आपकी समस्या के समाधान के लिए कार्य करेंगे।"""

    await bot.send_message(
        chat_id=TELEGRAM_CHAT_ID,
        text=message,
        parse_mode='Markdown',
        disable_web_page_preview=True
    )

    speak_hindi("आपकी शिकायत टेलीग्राम पर भेज दी गई है। आप शिकायत आईडी से ट्रैक कर सकते हैं। धन्यवाद।")

def send_telegram_message(data, complaint_id):
    asyncio.run(_send_message_async(data, complaint_id))
