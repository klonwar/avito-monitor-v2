import { TelegrafExecutionContext } from 'nestjs-telegraf'
import { Context } from 'telegraf'

import { Catch, ExceptionFilter, Logger } from '@nestjs/common'

@Catch(TypeError)
export class TypeExceptionFilter implements ExceptionFilter {
  private readonly DEFAULT_MESSAGE = `Invalid data. Please try again`
  private readonly logger = new Logger(TypeExceptionFilter.name)

  catch(exception, host): any {
    const tg = TelegrafExecutionContext.create(host)
    const botContext = tg.getContext<Context>()
    const message = 'text' in botContext.message! ? `"${botContext.message.text}"` : `(not text)`

    this.logger.error(
      `Exception caught when user @${botContext.from?.username || botContext.from?.id} wrote message ${message}`,
    )
    this.logger.error(exception.stack)

    return this.DEFAULT_MESSAGE
  }
}
