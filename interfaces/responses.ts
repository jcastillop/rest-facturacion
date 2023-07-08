export interface IResponseApi{
    transactionOk: boolean; 
    message: string; 
    response: any
}

export interface IResponseCorrelativo {
    correlativo: string | "";
    status:Boolean;
}

export interface IResponseComprobante {
    comprobante: any;
    status:Boolean;
}


