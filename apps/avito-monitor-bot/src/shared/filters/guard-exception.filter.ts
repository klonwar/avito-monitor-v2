import { TelegrafExecutionContext } from 'nestjs-telegraf'
import { Context } from 'telegraf'

import { Catch, ExceptionFilter, ForbiddenException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { GuardException } from '../exceptions/guard.exception'

@Catch(ForbiddenException)
export class GuardExceptionFilter implements ExceptionFilter {
  private readonly DEFAULT_MESSAGE: string
  private readonly logger = new Logger(GuardExceptionFilter.name)

  constructor(private configService: ConfigService) {
    this.DEFAULT_MESSAGE = `Your are not allowed to do this yet. Please contact @${this.configService.get<string>(
      'ADMIN',
    )} if you think this is a mistake`
  }

  catch(exception, host): any {
    const tg = TelegrafExecutionContext.create(host)
    const botContext = tg.getContext<Context>()
    const message = botContext.message && 'text' in botContext.message ? `"${botContext.message.text}"` : `(not text)`

    this.logger.warn(
      `Forbidden for user @${botContext.from?.username || botContext.from?.id} to write message ${message}`,
    )

    if (exception instanceof GuardException && exception.message) {
      return exception.message
    }

    return this.DEFAULT_MESSAGE
  }
}
