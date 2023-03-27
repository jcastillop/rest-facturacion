import express, { Application } from 'express';
import userRoutes from '../routes/usuarios';
import abastecimientoRoutes from '../routes/abastecimientos';
import comprobanteRoutes from '../routes/comprobantes';
import cors from 'cors'
import { Sqlcn } from '../database/config';


class Server{

    private app: Application;
    private port: string;
    private apiPaths = {
        usuarios: '/api/usuarios',
        abastecimientos: '/api/abastecimientos',
        comprobantes: '/api/comprobantes'
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
            await Sqlcn.authenticate();
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
        this.app.use(this.apiPaths.comprobantes, comprobanteRoutes);
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor ejecutandose en el puerto: ' + this.port)
        })
    }
}

export default Server;