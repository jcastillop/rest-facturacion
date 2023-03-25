import { create } from "xmlbuilder";
import {  } from "../models/comprobante";

export const crearFactura = ( comprobante: any ) => {

    var xml = create('Invoice', {version: '1.0', encoding: 'UTF-8', standalone: true})
    .att('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2')
    .att('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
    .att('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
    .att('xmlns:ccts', 'urn:un:unece:uncefact:documentation:2')
    .att('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2')
    .att('xmlns:qdt', 'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2')
    .att('xmlns:udt', 'urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2')
    .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    xml.ele('cbc:UBLVersionID','2.1');
    xml.ele('cbc:CustomizationID', {'schemeAgencyName': 'PE:SUNAT'},'2.1');
    xml.ele('cbc:ID',comprobante.numeracion_documento_afectado);
    xml.ele('cbc:IssueDate',comprobante.fecha_emision);
    xml.ele('cbc:DueDate',comprobante.fecha_emision); 
    xml.ele('cbc:InvoiceTypeCode', {'listAgencyName': 'PE:SUNAT','listID': '0101','listName': 'Tipo de Documento','listURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01'},'01'); 
    xml.ele('cbc:Note', {'languageLocaleID': '1000'},comprobante.monto_letras); 
    xml.ele('cbc:DocumentCurrencyCode',{'listAgencyName': 'United Nations Economic Commission for Europe','listID': 'ISO 4217 Alpha','listName': 'Currency'},comprobante.tipo_moneda);
    //emisor
    var emisor = xml.ele('cac:AccountingSupplierParty').ele('cac:Party');
    emisor.ele('cac:PartyIdentification')
        .ele('cbc:ID', {'schemeAgencyName': 'PE:SUNAT','schemeID': '6','schemeName': 'Documento de Identidad','schemeURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06'},process.env.EMISOR_RUC);
    var datos_emisor = emisor.ele('cac:PartyLegalEntity')
    datos_emisor.ele('cbc:RegistrationName','SIRCON ENERGY E.I.R.L.');
    var direccion_emisor = datos_emisor.ele('cac:RegistrationAddress');
    direccion_emisor.ele('cbc:ID','070106');
    direccion_emisor.ele('cbc:AddressTypeCode','0000');
    direccion_emisor.ele('cbc:StreetName','AV. NESTOR GAMBETA, KM 6.5');
    direccion_emisor.ele('cbc:CityName','CALLAO');
    direccion_emisor.ele('cbc:CountrySubentity','CALLAO');
    direccion_emisor.ele('cbc:District','VENTANILLA');
    direccion_emisor.ele('cac:Country')
        .ele('cac:Country', {'listAgencyID': 'United Nations Economic Commission for Europe','listID': 'ISO 3166-1','listName': 'Country'}, 'PE');
    //receptor
    var receptor = xml.ele('cac:AccountingCustomerParty').ele('cac:Party');
    receptor.ele('cac:PartyIdentification')
        .ele('cbc:ID', {'schemeAgencyName': 'PE:SUNAT','schemeID': '6','schemeName': 'Documento de Identidad','schemeURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06'},process.env.EMISOR_RUC);
    var datos_receptor = receptor.ele('cac:PartyLegalEntity')
    datos_receptor.ele('cbc:RegistrationName','EMPRESA DE TRANSPOR');
    var direccion_receptor = datos_receptor.ele('cac:RegistrationAddress');
    direccion_receptor.ele('cbc:AddressTypeCode','0000');
    direccion_receptor.ele('cbc:StreetName','CAL.ANTARES NRO. 119 URB. ALMTE. MIGUEL GRAU - VENTANILLA - CALLAO - CALLAO');
    //paymentterms
    var payment = xml.ele('cac:PaymentTerms');
    payment.ele('cbc:ID','FormaPago');
    payment.ele('cbc:PaymentMeansID','Contado');
    //total
    var tax_total = xml.ele('cac:TaxTotal');
    tax_total.ele('cbc:TaxAmount', {'currencyID': 'PEN'},'1.98');
    var tax_subtotal = tax_total.ele('cac:TaxSubtotal');
    tax_subtotal.ele('cbc:TaxableAmount', {'currencyID': 'PEN'},11.02);
    tax_subtotal.ele('cbc:TaxAmount', {'currencyID': 'PEN'},1.98);
    var tax_category = tax_subtotal.ele('cac:TaxCategory'); 
    tax_category.ele('cbc:ID', {'schemeAgencyName': 'United Nations Economic Commission for Europe','schemeID': 'UN/ECE 5305','schemeName': 'Tax Category Identifier'},'S');   
    var tax_scheme = tax_category.ele('cac:TaxScheme'); 
    tax_scheme.ele('cbc:ID', {'schemeAgencyName': 'PE:SUNAT','schemeName': 'Codigo de tributos','schemeURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05'},1000);   
    tax_scheme.ele('cbc:Name','IGV');
    tax_scheme.ele('cbc:TaxTypeCode','VAT');
    //legal monetary total
    var legal_monetary_total = xml.ele('cac:LegalMonetaryTotal');
    legal_monetary_total.ele('cbc:LineExtensionAmount', {'currencyID': 'PEN'},11.02);
    legal_monetary_total.ele('cbc:TaxInclusiveAmount', {'currencyID': 'PEN'},13.00);
    legal_monetary_total.ele('cbc:PayableRoundingAmount', {'currencyID': 'PEN'},0.00);
    legal_monetary_total.ele('cbc:PayableAmount', {'currencyID': 'PEN'},13.00);
    //invoice line
    
    comprobante.Items.forEach((item:any) => {
        var i : number = 1;
        var items = xml.ele('cac:InvoiceLine');
        items.ele('cbc:ID',i);
        items.ele('cbc:InvoicedQuantity', {'unitCode': 'GLL','unitCodeListAgencyName': 'United Nations Economic Commission for Europe','unitCodeListID': 'UN/ECE rec 20'}, item.cantidad);
        items.ele('cbc:LineExtensionAmount', {'currencyID': 'PEN'},item.valor_venta);

        var pricing_reference = items.ele('cac:PricingReference');
        var alternative_condition = pricing_reference.ele('cac:AlternativeConditionPrice');
        alternative_condition.ele('cbc:PriceAmount', {'currencyID': 'PEN'},item.precio_unitario);
        alternative_condition.ele('cbc:PriceTypeCode', {'listAgencyName': 'PE:SUNAT','listName': 'Tipo de Precio','listURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16'},'01');

        var tax_total = items.ele('cac:TaxTotal');
        tax_total.ele('cbc:TaxAmount', {'currencyID': 'PEN'},item.igv);
        var tax_subtotal = tax_total.ele('cac:TaxSubtotal');
        tax_subtotal.ele('cbc:TaxableAmount', {'currencyID': 'PEN'},item.valor_venta);
        tax_subtotal.ele('cbc:TaxAmount', {'currencyID': 'PEN'}, item.igv);
        var tax_category = tax_subtotal.ele('cac:TaxCategory');
        tax_category.ele('cbc:ID', {'schemeAgencyName': 'United Nations Economic Commission for Europe','schemeID': 'UN/ECE 5305','schemeName': 'Tax Category Identifier'},'S'); 
        tax_category.ele('cbc:Percent', '18.00');
        tax_category.ele('cbc:TaxExemptionReasonCode', {'listAgencyName': 'PE:SUNAT','listName': 'Afectacion del IGV','listURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07'},10); 
        var tax_scheme = tax_category.ele('cac:TaxScheme');
        tax_scheme.ele('cbc:ID', {'schemeAgencyName': 'PE:SUNAT','schemeName': 'Codigo de tributos','schemeURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05'},1000); 
        tax_scheme.ele('cbc:Name', 'IGV');
        tax_scheme.ele('cbc:TaxTypeCode', 'VAT');

        var comp_item = items.ele('cac:Item');
        comp_item.ele('cbc:Description', item.descripcion);
        comp_item.ele('cac:SellersItemIdentification').ele('cbc:ID',item.codigo_producto);
        var additional_prop = comp_item.ele('cac:AdditionalItemProperty');
        additional_prop.ele('cbc:Name', 'PLACA');
        additional_prop.ele('cbc:ID', {'listAgencyName': 'PE:SUNAT','listName': 'Propiedad del item','listURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo55'},5010); 
        additional_prop.ele('cbc:Value', item.placa);

        var price = items.ele('cac:Price');
        price.ele('cbc:PriceAmount', {'currencyID': 'PEN'}, item.valor_unitario);
    });

    return xml.end({ pretty: true});
}