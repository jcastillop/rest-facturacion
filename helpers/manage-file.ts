import { promises as fsPromises, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export const asyncWriteFile = async ( filename: string, data: any ) => {
    //extensionesValidas = ['txt','xml'], carpeta:string = '',
    try {
        // await fsPromises.writeFile(join( __dirname, filename), data, {
        await fsPromises.writeFile(join( 'D:\\SolucionesOP\\FacturacionOP\\Fuentes\\rest-facturacion\\data\\xml\\', filename), data, {
          flag: 'w',
        });
        /*
        const contents = await fsPromises.readFile(
          join(__dirname, filename),
          'utf-8',
        );
        */
        //console.log(contents);
    
        //return contents;
      } catch (err) {
        //console.log(err);
        return 'Something went wrong';
      }
}
export const syncWriteFile = (filename: string, data: any) => {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    console.log(__dirname);
    console.log(filename);
    writeFileSync(join(__dirname, filename), data, {
      flag: 'w',
    });
  
    const contents = readFileSync(join(__dirname, filename), 'utf-8');
    //console.log(contents); // 👉️ "One Two Three Four"
  
    return contents;
  }