import { Injectable } from '@nestjs/common'

@Injectable()
export class MessageService {
  constructor() {}

  /*
  public async notifyTemplate(pageJob: PageJob) {
    const url = pageJob.url
    const updated = moment(pageJob.updated_at).format('HH:mm:SS DD.MM.YYYY')

    const lines = [`📅 Date: ${updated}`, ``, `🔗 URL: ${url}`]

    return this.fromLines(lines)
  }
*/

  private fromParts(parts: string[]) {
    return parts.filter((item) => item !== null).join(` `)
  }

  private fromLines(lines: string[]) {
    return lines.filter((item) => item !== null).join(`\n`)
  }
}
