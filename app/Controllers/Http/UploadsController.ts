import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { exec, spawn } from 'child_process'
// import Env from '@ioc:Adonis/Core/Env'

export default class UploadsController {
  public async upload({ request, response }: HttpContextContract) {
    // Buat di simpan di luar build
    // const imageResources = request.file('image')
    // Buat di simpan di build
    const image = request.file('image')
    const fileName = request.input('fileName');
    const fileDir = request.input('fileDir');

    if (image) {
      // Kalo di server
      if (Application.inProduction) {
        
        // === testing ===
        const publicPath = Application.makePath(`./public/assets/files/${fileDir}`)
        const publicName = `${fileName}.${image.extname}`
        const resourcesPath = Application.makePath(`../resources/files/${fileDir}`)
        const resourcesName = `${fileName}.${image.extname}`
        // const resourcesPath = Env.get('DRIVE_ROOT')
        // === Buat DIrectory utk menyimpan gambar ===
        
        // Pindahkan file ke direktori public yg ada di build
        await image.move(publicPath, {
          name: publicName,
        })

        // Buat direktori file utk resource path
        // mkdir dirName -p -> kalo direktori udh ada, maka tidak ada error dan file yg ada di dlmnya tidak diganggu / file yg udh ada nggak hilang
        // exec(`mkdir ${resourcesPath} -p`)
        const makeResourceDir = spawn('mkdir', [resourcesPath, '-p'])
        
        let errorStr = ''
        let stdoutStr = ''
        let stderrStr = ''
        makeResourceDir.on('close', () => {
          // Copy image ke resources path setelah direktori resources dibuat
          exec(
            `cp "${publicPath}/${publicName}" "${resourcesPath}/${resourcesName}"`,
            (error, stdout, stderr) => {
              if (error) {
                errorStr = `${error}`
              }
              if (stderr) {
                stderrStr = `${stderr}`
              }
              stdoutStr = `${stdout}`
            }
          )
        })


        return response.send({ publicPath, errorStr, stderrStr, stdoutStr })
        // return response.send({ publicPath, resourcesPath })
        
      }
    }
  }
}
