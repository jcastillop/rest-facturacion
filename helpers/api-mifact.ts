import axios from 'axios';
import { posApi } from '../api';
import { log4js } from './log4js';

export interface PropsMiFact {
    hasErrorMiFact: boolean; 
    messageMiFact: string; 
    response: any
}

export const createOrderApiMiFact = async(comprobante : any, receptor: any, tipo_comprobante: string, correlativo: string): Promise<PropsMiFact> => {
    log4js( "Inicio createOrderApiMiFact");
    try {

        var splitted = correlativo.split("-");
        
        var tot_valor_venta = 0;
        var tot_precio_unitario = 0;

        comprobante.Items.forEach((item:any) => {
            tot_valor_venta += parseFloat(item.valor_unitario)*parseFloat(item.cantidad)
        });
        var str_tot_valor_venta = tot_valor_venta.toFixed(2);
        var str_tot_precio_venta = (tot_valor_venta*1.18).toFixed(2);
        var str_tot_igv = (tot_valor_venta*0.18).toFixed(2);

        var arr_items: any = [] 

        comprobante.Items.forEach((item:any) => {
            arr_items.push(
                {
                    "COD_ITEM": "BCF-RR01",
                    "COD_UNID_ITEM": "NIU",
                    "CANT_UNID_ITEM": item.cantidad,
                    "VAL_UNIT_ITEM": parseFloat(item.valor_unitario).toFixed(2),      
                    "PRC_VTA_UNIT_ITEM": item.precio_unitario,
                    "VAL_VTA_ITEM": str_tot_valor_venta,
                    "MNT_BRUTO": str_tot_valor_venta,
                    "MNT_PV_ITEM": item.precio_unitario,
                    "COD_TIP_PRC_VTA": "01",
                    "COD_TIP_AFECT_IGV_ITEM":"10",
                    "COD_TRIB_IGV_ITEM": "1000",
                    "POR_IGV_ITEM": "18",
                    "MNT_IGV_ITEM": parseFloat(item.igv).toFixed(2),
                    "TXT_DESC_ITEM": item.descripcion,                  
                    "DET_VAL_ADIC01": "",
                    "DET_VAL_ADIC02": "",
                    "DET_VAL_ADIC03": "",
                    "DET_VAL_ADIC04": ""                
                }
            )
        });

        const body = {
            "TOKEN":"gN8zNRBV+/FVxTLwdaZx0w==", // token del emisor, este token gN8zNRBV+/FVxTLwdaZx0w== es de pruebas
            "COD_TIP_NIF_EMIS": "6",
            "NUM_NIF_EMIS": "20100100100",
            "NOM_RZN_SOC_EMIS": process.env.EMISOR_RS,
            "NOM_COMER_EMIS": process.env.EMISOR_COMERCIAL,
            "COD_UBI_EMIS": process.env.EMISOR_UBIGEO,
            "TXT_DMCL_FISC_EMIS": process.env.EMISOR_DIR,
            "COD_TIP_NIF_RECP": receptor.tipo_documento,
            "NUM_NIF_RECP": receptor.numero_documento,
            "NOM_RZN_SOC_RECP": receptor.razon_social,
            "TXT_DMCL_FISC_RECEP": receptor.direccion,
            "FEC_EMIS": comprobante.fecha_emision,
            "FEC_VENCIMIENTO": comprobante.fecha_emision,
            "COD_TIP_CPE": tipo_comprobante,
            "NUM_SERIE_CPE": splitted[0],
            "NUM_CORRE_CPE": splitted[1],
            "COD_MND": "PEN",
            "MailEnvio": receptor.correo,
            "COD_PRCD_CARGA": "001",
            "MNT_TOT_GRAVADO": str_tot_valor_venta, 
            "MNT_TOT_TRIB_IGV": str_tot_igv, 
            "MNT_TOT": str_tot_precio_venta, 
            "COD_PTO_VENTA": "jmifact",
            "ENVIAR_A_SUNAT": "false",
            "RETORNA_XML_ENVIO": "false",
            "RETORNA_XML_CDR": "false",
            "RETORNA_PDF": "false",
            "COD_FORM_IMPR":"001",
            "TXT_VERS_UBL":"2.1",
            "TXT_VERS_ESTRUCT_UBL":"2.0",
            "COD_ANEXO_EMIS":"0000",
            "COD_TIP_OPE_SUNAT": "0101",
            "items": arr_items
        }


        const { data } = await posApi.post(`${process.env.MIFACT_API}/api/invoiceService.svc/SendInvoice`, body);
        //console.log(process.env.MIFACT_API);
        log4js( "Fin createOrderApiMiFact");
        if(data.errors){
            return {
                hasErrorMiFact: true,
                messageMiFact: data.errors ,
                response: data
            }
        }else{
            return {
                hasErrorMiFact: false,
                messageMiFact: 'Comprobante registrado correctamente ' ,
                response: data
            }
        }
    } catch (error: any) {
        log4js( "createOrderApiMiFact: " + error.toString(), 'error');
        log4js( "Fin createOrderApiMiFact");
        if ( axios.isAxiosError(error) ) {
            return {
                hasErrorMiFact: true,
                messageMiFact: "createOrderApiMiFact: " + error.response?.data.message,
                response: null
            }
        }
        return {
            hasErrorMiFact: true,
            messageMiFact : 'Error no controlado, hable con el administrador ' + error,
            response: null
        }        
    }
    
}
