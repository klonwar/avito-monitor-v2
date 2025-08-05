import type { InlineKeyboardButton } from '@telegraf/types'

export enum ListLinkAction {
  CANCEL = 'cancel',
}

export const ListLinkActionToDescription: Record<ListLinkAction, string> = {
  [ListLinkAction.CANCEL]: '⬅️ Back',
}

export const ListLinkKeyboard: InlineKeyboardButton[][] = [
  [
    {
      text: ListLinkActionToDescription[ListLinkAction.CANCEL],
      callback_data: ListLinkAction.CANCEL,
    },
  ],
]
