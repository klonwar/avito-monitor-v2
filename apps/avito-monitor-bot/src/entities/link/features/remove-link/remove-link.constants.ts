import type { InlineKeyboardButton } from '@telegraf/types'

export enum RemoveLinkAction {
  CANCEL = 'cancel',
  UNSUBSCRIBE = 'unsubscribe',
}

export const RemoveLinkActionToDescription: Record<RemoveLinkAction, string> = {
  [RemoveLinkAction.CANCEL]: '⬅️ Back',
  [RemoveLinkAction.UNSUBSCRIBE]: '⛓️‍💥 Unsubscribe',
}

export const RemoveLinkKeyboard: InlineKeyboardButton[][] = [
  [
    {
      text: RemoveLinkActionToDescription[RemoveLinkAction.CANCEL],
      callback_data: RemoveLinkAction.CANCEL,
    },
  ],
]
