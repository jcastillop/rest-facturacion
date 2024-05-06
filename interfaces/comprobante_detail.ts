export interface IComprobanteDetail{
    id: Number;
    ComprobanteId: Number;
    cantidad: string;
    valor_unitario: string;
    precio_unitario: string;
    igv: string;
    igv_total: string;
    descripcion: string;
    codigo: string;
    placa: string;
    unidad_medida: string;
    valor_total: string;
    precio_total: string;
    descuento?: Number;
}