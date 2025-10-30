from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import os

TOKEN = os.getenv("7915005704:AAGAtP4c5fE26R4TWY0yaWPFcULPgL2oSdY")  # BotFather-ից քո token-ը, GitHub-ում կավելացնենք որպես secret

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    # Պահենք user-ների ID-ները ֆայլում
    if not os.path.exists("users.txt"):
        open("users.txt", "w").close()

    with open("users.txt", "a+") as f:
        f.seek(0)
        users = f.read().splitlines()
        if str(user_id) not in users:
            f.write(f"{user_id}\n")

    count = len(open("users.txt").read().splitlines())
    await update.message.reply_text(f"Բարի գալուստ 👋 Դուք {count}-րդ օգտատերն եք բոտում։")

app = ApplicationBuilder().token(TOKEN).build()
app.add_handler(CommandHandler("start", start))

print("🤖 Bot is running...")
app.run_polling()
