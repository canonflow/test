import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import __dirname from "../../../commands";

export default class UploadsController {
  public async upload({ request, response }: HttpContextContract) {
    const image = request.file('image')
    if (image !== null) {
      await image.moveToDisk('./', { name: `test.${image.extname}` })
      const fileName = image.fileName
      // const fileTmp = image.tmpPath
      const filePath = image.filePath

      return response.send({ filePath, fileName })
    }
  }
}
