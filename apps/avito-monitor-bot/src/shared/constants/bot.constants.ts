import { BotCommand as TelegramBotCommand } from '@telegraf/types'

// todo think about aggregating
export enum BotScene {
  REGISTRATION = 'registration',
  INFO = 'info',
  ADD_LINK = 'add-link',
  REMOVE_LINK = 'remove-link',
}

export enum BotCommand {
  START = 'start',
  CONFIGURE_LINKS = 'links',
}

export const BotCommandToDescription: Record<BotCommand, string> = {
  [BotCommand.START]: 'Start an account',
  [BotCommand.CONFIGURE_LINKS]: 'Configure links',
}

export const TelegramBotCommands: TelegramBotCommand[] = Object.entries(BotCommandToDescription).map(
  ([key, value]) => ({
    command: key,
    description: value,
  }),
)
