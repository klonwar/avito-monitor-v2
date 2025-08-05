import { TelegrafExecutionContext } from 'nestjs-telegraf'
import { Context } from 'telegraf'

import { Catch, ExceptionFilter, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  private readonly DEFAULT_MESSAGE: string

  private readonly logger = new Logger(AnyExceptionFilter.name)

  constructor(private configService: ConfigService) {
    this.DEFAULT_MESSAGE = `Error occurred. Please try again later or contact @${this.configService.get<string>(
      'ADMIN',
    )}`
  }

  catch(exception, host): any {
    const tg = TelegrafExecutionContext.create(host)
    const botContext = tg.getContext<Context>()
    const message = botContext.message && 'text' in botContext.message ? `"${botContext.message.text}"` : `(not text)`

    this.logger.error(
      `Exception caught when user @${botContext.from?.username || botContext.from?.id} wrote message ${message}`,
    )
    this.logger.error(exception.stack)

    return this.DEFAULT_MESSAGE
  }
}
