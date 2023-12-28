import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { exec } from 'child_process'
import Env from '@ioc:Adonis/Core/Env'

export default class UploadsController {
  public async upload({ request, response }: HttpContextContract) {
    // Buat di simpan di luar build
    // const imageResources = request.file('image')
    // Buat di simpan di build
    const image = request.file('image')

    if (image) {
      // Kalo di server
      if (Application.inProduction) {
        // === testing ===
        const publicPath = Application.makePath('./public/assets/files')
        const publicName = `build-public.${image.extname}`
        const resourcesPath = Env.get('DRIVE_ROOT')
        const resourcesName = `test-resources.${image.extname}`

        await image.move(publicPath, {
          name: publicName,
        })

        exec(`cp "${publicPath}/${publicName}" "${resourcesPath}/${resourcesName}"`)

        // await imageResources.moveToDisk(resourcePath, {
        //   name: `test-resources.${imageResources.extname}`,
        // })
        return response.send({ publicPath })
        // Simpan server
        // await imageResources.moveToDisk('./', { name: `test1.${imageResources.extname}` })
        // // Simpan di build
        // await imagePublic.move(Application.appRoot + '/public/assets/files/', {
        //   name: `test1.${imagePublic.extname}`,
        // })
        //
        // const resourcePath = imageResources.filePath
        // const publicPath = imagePublic.filePath
        // return response.send({ resourcePath, publicPath })
      }
      // await image.moveToDisk('./', { name: `test.${image.extname}` })
      // const file = await Drive.get(`./test.${image.extname}`).toString()
      // await Drive.put(Application.appRoot + '/public/assets/files', file)
      // await image.move(Application.appRoot + '/public/assets/files', {
      //   name: `test.${image.extname}`,
      // })
      // const fileName = image.fileName
      // const fileTmp = image.tmpPath
      // const filePath = image.filePath

      // return response.send({ filePath, fileName })
    }
  }
}
