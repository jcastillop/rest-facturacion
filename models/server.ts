import express, { Application } from 'express';
import abastecimientoRoutes from '../routes/abastecimientos';
import comprobanteRoutes from '../routes/comprobantes';
import userRoutes from '../routes/usuarios';
import receptorRoutes from '../routes/receptores';
import cors from 'cors'

class Server{

    private app: Application;
    private port: string;
    private apiPaths = {
        abastecimientos: '/api/abastecimientos',
        comprobantes: '/api/comprobantes',
        usuarios: '/api/usuarios',
        receptores: '/api/receptores'
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
            //await Sqlcn().authenticate();
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
        this.app.use(this.apiPaths.abastecimientos, abastecimientoRoutes);
        this.app.use(this.apiPaths.comprobantes, comprobanteRoutes);
        this.app.use(this.apiPaths.usuarios, userRoutes);
        this.app.use(this.apiPaths.receptores, receptorRoutes)
    }

    listen(){
        this.app.listen(this.port, ()=>{
            
            console.log('Servidor ejecutandose en el puerto: ' + this.port)
        })
    }
}

export default Server;