import { IReceptor } from "./receptor";

export interface IComprobanteAdmin {
    Receptor: IReceptor;
    numeracion: string;
    tipo_comprobante: string;
    numeracion_comprobante: string;
    fecha_emision: string;    
    moneda: string;
    tipo_operacion: string;
    tipo_nota: string;
    tipo_documento_afectado: string;
    numeracion_documento_afectado: string;
    fecha_documento_afectado: string;
    motivo_documento_afectado: string;
    gravadas: number;
    igv: number;
    total: number;
    monto_letras: string;
    cadena_para_codigo_qr: string;
    codigo_hash: string;
    pdf: string;
    url: string;
    errors: string;
    id_abastecimiento: number;
    pistola: number;
    codigo_combustible: string;
    dec_combustible: string;
    volumen: number;
    fecha_abastecimiento: string;    
    tiempo_abastecimiento: number;
    volumen_tanque: number;
    comentario: string;    
    tarjeta: number;
    efectivo: number;
    placa: string;
    billete: number;
    producto_precio: number;
    usuarioId: number;
    ruc: string;
    yape: number;
    items: IComprobanteAdminItem[];
}
export interface IComprobanteAdminItem {
    cantidad: number;
    precio: number;
    valor: number;
    igv: number;
    valor_venta: number;
    precio_venta: number;
    descripcion: string;
    codigo_producto: string;
    medida: string;
}