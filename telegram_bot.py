"""
Simple Telegram bot for the Arthunter art school.

This bot demonstrates how to respond to common questions using predefined
templates. To make the bot work, install the python‑telegram‑bot library and
replace the BOT_TOKEN placeholder with your own token obtained from
@BotFather. Running this script will start the bot and listen for messages.

The bot uses a reply keyboard so users can tap buttons to get quick answers.

Example usage:

    export BOT_TOKEN='123456:ABC...'
    python telegram_bot.py

"""

import os
from telegram import Update, ReplyKeyboardMarkup
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters

# Predefined answers for frequently asked questions.
TEMPLATES = {
    'Как зайти в личный кабинет': (
        'Чтобы попасть в личный кабинет, откройте наш сайт Arthunter и нажмите кнопку "Личный кабинет" в правом верхнем углу. '
        'Введите адрес электронной почты, который вы использовали при покупке курса, и пароль. Если забыли пароль, '
        'воспользуйтесь ссылкой "Забыли пароль?" и следуйте инструкциям на экране.'
    ),
    'Как выбрать курс': (
        'На странице Курсы вы можете фильтровать программы по уровню, материалу и времени. '
        'Выберите параметры, подходящие вашему опыту и интересам, и изучите описание каждого курса. '
        'Если сомневаетесь, воспользуйтесь формой "Найдите свой курс" на главной странице или свяжитесь с нами — мы подскажем.'
    ),
    'Как получить сертификат': (
        'После завершения всех уроков и сдачи домашних работ вам будет доступен сертификат. '
        'Скачайте его в личном кабинете в разделе "Мои достижения". Сертификат можно распечатать или добавить в портфолио.'
    ),
    'Как обратиться в поддержку': (
        'Если у вас возникли вопросы или проблемы, напишите нам в чат на сайте, на почту support@arthunter.school, '
        'или в Telegram @ArthunterSupport. Мы работаем с понедельника по субботу с 9:00 до 18:00 (MSK) и стараемся отвечать как можно быстрее.'
    ),
}


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    keyboard = [[k] for k in TEMPLATES.keys()]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True, one_time_keyboard=False)
    await update.message.reply_text(
        f'Здравствуйте, {user.first_name or "друг"}! Я бот школы Arthunter. Выберите вопрос из списка, '
        'и я постараюсь помочь:',
        reply_markup=reply_markup
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Reply to user messages with corresponding template."""
    text = update.message.text.strip()
    response = TEMPLATES.get(text)
    if response:
        await update.message.reply_text(response)
    else:
        await update.message.reply_text(
            'Извините, я пока не знаю ответа на этот вопрос. Попробуйте выбрать один из готовых вариантов на клавиатуре '
            'или обратитесь в нашу службу поддержки.'
        )


async def main() -> None:
    """Start the bot."""
    token = os.getenv('BOT_TOKEN')
    if not token:
        raise EnvironmentError('Please set the BOT_TOKEN environment variable with your Telegram bot token.')
    application = ApplicationBuilder().token(token).build()
    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    await application.initialize()
    await application.start()
    print('Bot is running. Press CTRL+C to stop.')
    await application.updater.start_polling()
    await application.updater.idle()


if __name__ == '__main__':
    import asyncio
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('Bot stopped.')