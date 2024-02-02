import express, { Application } from 'express';
import cors from 'cors'
import { Sqlcn } from '../database/config';
import abastecimientoRoutes from '../routes/abastecimientos';
import comprobanteRoutes from '../routes/comprobantes';
import userRoutes from '../routes/usuarios';
import receptorRoutes from '../routes/receptores';
import productoRoutes from '../routes/productos';
import gastoRoutes from '../routes/gastos';
import depositoRoutes from '../routes/depositos';
import { CronJob } from 'cron';
import { automatismosCambiarComprobantesInternos, procesarComprobantes } from '../helpers/app-helpers';

class Server{

    private app: Application;
    private port: string;
    private apiPaths = {
        abastecimientos: '/api/abastecimientos',
        comprobantes: '/api/comprobantes',
        usuarios: '/api/usuarios',
        receptores: '/api/receptores',
        productos: '/api/productos',
        gastos: '/api/gastos',
        depositos: '/api/depositos'
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '8800';
        this.conectarDB();
        this.middlewares();
        this.routes();
        this.automatismos();
    }

    async conectarDB(){
        //await dbConnection()
        try {
            //await Sqlcn().authenticate();
            Sqlcn.sync()
            console.log('database on lines'+ process.env.SQL_CONTR_HOST )
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
        this.app.use(this.apiPaths.receptores, receptorRoutes);
        this.app.use(this.apiPaths.productos, productoRoutes);
        this.app.use(this.apiPaths.gastos, gastoRoutes);
        this.app.use(this.apiPaths.depositos, depositoRoutes);
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor ejecutandose en el puerto: ' + this.port + process.env.SQL_CONTR_HOST )
        })
    }

    automatismos(){
        console.log('Los envíos asincronos se encuentran ' + (process.env.ENVIOS_ASINCRONOS=='1'? 'ENCENDIDOS':'APAGADOS'))
        if(process.env.ENVIOS_ASINCRONOS == '1'){


            const job = new CronJob(
                '* * * * *', // cronTime
                function () {
                    procesarComprobantes()
                }, // onTick
                null, // onComplete
                true, // start
            );            
        }
        if(process.env.AUTOMATIC_BILLING == '1'){
            const job = new CronJob(
                '* * * * *', // cronTime
                function () {
                    automatismosCambiarComprobantesInternos()
                }, // onTick
                null, // onComplete
                true, // start
            );              
        }
    }
}

export default Server;