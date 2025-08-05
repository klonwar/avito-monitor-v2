import { BotCommand } from '@telegraf/types'

export enum AvailableCommands {
  START = 'start',
  CREATE = 'create',
  DELETE = 'delete',
}

export const BotCommandsDescriptions: Record<AvailableCommands, string> = {
  [AvailableCommands.START]: 'Start an account',
  [AvailableCommands.CREATE]: 'Start a job',
  [AvailableCommands.DELETE]: 'Delete a job',
}

export const myCommands: BotCommand[] = Object.entries(BotCommandsDescriptions).map(([key, value]) => ({
  command: key,
  description: value,
}))
