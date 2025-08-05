import type { InlineKeyboardButton } from '@telegraf/types'

export enum AddLinkAction {
  CANCEL = 'cancel',
  UNSUBSCRIBE = 'unsubscribe',
}

export const AddLinkActionToDescription: Record<AddLinkAction, string> = {
  [AddLinkAction.CANCEL]: '⬅️ Back',
  [AddLinkAction.UNSUBSCRIBE]: '⛓️‍💥 Unsubscribe',
}

export const AddLinkKeyboard: InlineKeyboardButton[][] = [
  [
    {
      text: AddLinkActionToDescription[AddLinkAction.CANCEL],
      callback_data: AddLinkAction.CANCEL,
    },
  ],
]
