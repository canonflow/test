import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Drive from "@ioc:Adonis/Core/Drive";

export default class UploadsController {
  public async upload({ request, response }: HttpContextContract) {
    const image = request.file('image')

    if (image !== null) {
      await image.moveToDisk('./', { name: `test.${image.extname}` })
      const file = await Drive.get(`./test.${image.extname}`).toString()
      await Drive.put(Application.appRoot + '/public/assets/files', file)
      // await image.move(Application.appRoot + '/public/assets/files', {
      //   name: `test.${image.extname}`,
      // })
      const fileName = image.fileName
      // const fileTmp = image.tmpPath
      const filePath = image.filePath

      return response.send({ filePath, fileName })
    }
  }
}
