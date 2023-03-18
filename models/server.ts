import express, { Application } from 'express';
import userRoutes from '../routes/usuarios';
import abastecimientoRoutes from '../routes/abastecimientos';
import cors from 'cors'
///import dbConnection from '../database/config';
import db from '../database/config';


class Server{

    private app: Application;
    private port: string;
    private apiPaths = {
        usuarios: '/api/usuarios',
        abastecimientos: '/api/abastecimientos'
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '8800';
        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB(){
        //await dbConnection()
        try {
            await db.authenticate();
            console.log('database on lines')
        } catch (error) {
            
        }
    }

    middlewares(){
        //CORS
        this.app.use(cors())
        //Lectura body
        this.app.use(express.json());
        //Carepta publica
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.apiPaths.usuarios, userRoutes);
        this.app.use(this.apiPaths.abastecimientos, abastecimientoRoutes);
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor ejecutandose en el puerto: ' + this.port)
        })
    }
}

export default Server;