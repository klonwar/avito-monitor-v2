import type { InlineKeyboardButton } from '@telegraf/types'

export enum ConfigureLinksAction {
  ADD = 'add_link',
  REMOVE = 'remove_link',
  LIST = 'list_links',
}

export const ConfigureLinksActionToDescription: Record<ConfigureLinksAction, string> = {
  [ConfigureLinksAction.ADD]: '🔗 Subscribe',
  [ConfigureLinksAction.REMOVE]: '⛓️‍💥 Unsubscribe',
  [ConfigureLinksAction.LIST]: '📃 Show subscriptions',
}

export const ConfigureLinksKeyboard: InlineKeyboardButton[][] = [
  [
    {
      text: ConfigureLinksActionToDescription[ConfigureLinksAction.ADD],
      callback_data: ConfigureLinksAction.ADD,
    },
    {
      text: ConfigureLinksActionToDescription[ConfigureLinksAction.REMOVE],
      callback_data: ConfigureLinksAction.REMOVE,
    },
  ],
  [
    {
      text: ConfigureLinksActionToDescription[ConfigureLinksAction.LIST],
      callback_data: ConfigureLinksAction.LIST,
    },
  ],
]
