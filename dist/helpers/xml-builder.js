"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeXMLFactura = void 0;
const xmlbuilder_1 = require("xmlbuilder");
const makeXMLFactura = (comprobante, receptor) => {
    var tot_valor_venta = 0;
    var tot_precio_unitario = 0;
    comprobante.Items.forEach((item) => {
        tot_valor_venta += parseFloat(item.valor_unitario) * parseFloat(item.cantidad);
    });
    var str_tot_valor_venta = tot_valor_venta.toFixed(2);
    var str_tot_precio_venta = (tot_valor_venta * 1.18).toFixed(2);
    var str_tot_igv = (tot_valor_venta * 0.18).toFixed(2);
    var xml = (0, xmlbuilder_1.create)('Invoice', { version: '1.0', encoding: 'UTF-8', standalone: true })
        .att('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2')
        .att('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2')
        .att('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2')
        .att('xmlns:ccts', 'urn:un:unece:uncefact:documentation:2')
        .att('xmlns:ext', 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2')
        .att('xmlns:qdt', 'urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2')
        .att('xmlns:udt', 'urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2')
        .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    xml.ele('cbc:UBLVersionID', '2.1');
    xml.ele('cbc:CustomizationID', { 'schemeAgencyName': 'PE:SUNAT' }, '2.0');
    xml.ele('cbc:ID', comprobante.numeracion_comprobante);
    xml.ele('cbc:IssueDate', comprobante.fecha_emision);
    xml.ele('cbc:DueDate', comprobante.fecha_emision);
    xml.ele('cbc:InvoiceTypeCode', { 'listAgencyName': 'PE:SUNAT', 'listID': '0101', 'listName': 'Tipo de Documento', 'listURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01' }, '01');
    xml.ele('cbc:Note', { 'languageLocaleID': '1000' }, comprobante.monto_letras);
    xml.ele('cbc:DocumentCurrencyCode', { 'listAgencyName': 'United Nations Economic Commission for Europe', 'listID': 'ISO 4217 Alpha', 'listName': 'Currency' }, comprobante.tipo_moneda);
    //emisor
    var emisor = xml.ele('cac:AccountingSupplierParty').ele('cac:Party');
    emisor.ele('cac:PartyIdentification')
        .ele('cbc:ID', { 'schemeAgencyName': 'PE:SUNAT', 'schemeID': '6', 'schemeName': 'Documento de Identidad', 'schemeURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06' }, process.env.EMISOR_RUC);
    var datos_emisor = emisor.ele('cac:PartyLegalEntity');
    datos_emisor.ele('cbc:RegistrationName', process.env.EMISOR_RS);
    var direccion_emisor = datos_emisor.ele('cac:RegistrationAddress');
    direccion_emisor.ele('cbc:ID', '070106');
    direccion_emisor.ele('cbc:AddressTypeCode', '0000');
    direccion_emisor.ele('cbc:StreetName', 'AV. NESTOR GAMBETA, KM 6.5');
    direccion_emisor.ele('cbc:CityName', 'CALLAO');
    direccion_emisor.ele('cbc:CountrySubentity', 'CALLAO');
    direccion_emisor.ele('cbc:District', 'VENTANILLA');
    direccion_emisor.ele('cac:Country')
        .ele('cbc:IdentificationCode', { 'listAgencyID': 'United Nations Economic Commission for Europe', 'listID': 'ISO 3166-1', 'listName': 'Country' }, 'PE');
    //receptor
    var xml_receptor = xml.ele('cac:AccountingCustomerParty').ele('cac:Party');
    xml_receptor.ele('cac:PartyIdentification')
        .ele('cbc:ID', { 'schemeAgencyName': 'PE:SUNAT', 'schemeID': receptor.tipo_documento, 'schemeName': 'Documento de Identidad', 'schemeURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo06' }, receptor.numero_documento);
    var datos_receptor = xml_receptor.ele('cac:PartyLegalEntity');
    datos_receptor.ele('cbc:RegistrationName', receptor.razon_social);
    var direccion_receptor = datos_receptor.ele('cac:RegistrationAddress');
    direccion_receptor.ele('cbc:AddressTypeCode', '0000');
    direccion_receptor.ele('cbc:StreetName', receptor.direccion);
    //paymentterms
    var payment = xml.ele('cac:PaymentTerms');
    payment.ele('cbc:ID', 'FormaPago');
    payment.ele('cbc:PaymentMeansID', 'Contado');
    //total
    var tax_total = xml.ele('cac:TaxTotal');
    tax_total.ele('cbc:TaxAmount', { 'currencyID': 'PEN' }, str_tot_igv);
    var tax_subtotal = tax_total.ele('cac:TaxSubtotal');
    tax_subtotal.ele('cbc:TaxableAmount', { 'currencyID': 'PEN' }, str_tot_valor_venta);
    tax_subtotal.ele('cbc:TaxAmount', { 'currencyID': 'PEN' }, str_tot_igv);
    var tax_category = tax_subtotal.ele('cac:TaxCategory');
    tax_category.ele('cbc:ID', { 'schemeAgencyName': 'United Nations Economic Commission for Europe', 'schemeID': 'UN/ECE 5305', 'schemeName': 'Tax Category Identifier' }, 'S');
    var tax_scheme = tax_category.ele('cac:TaxScheme');
    tax_scheme.ele('cbc:ID', { 'schemeAgencyName': 'PE:SUNAT', 'schemeName': 'Codigo de tributos', 'schemeURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05' }, 1000);
    tax_scheme.ele('cbc:Name', 'IGV');
    tax_scheme.ele('cbc:TaxTypeCode', 'VAT');
    //legal monetary total
    var legal_monetary_total = xml.ele('cac:LegalMonetaryTotal'); //Formatear a dos decimales 
    legal_monetary_total.ele('cbc:LineExtensionAmount', { 'currencyID': 'PEN' }, str_tot_valor_venta);
    legal_monetary_total.ele('cbc:TaxInclusiveAmount', { 'currencyID': 'PEN' }, str_tot_precio_venta);
    legal_monetary_total.ele('cbc:PayableRoundingAmount', { 'currencyID': 'PEN' }, '0.00');
    legal_monetary_total.ele('cbc:PayableAmount', { 'currencyID': 'PEN' }, str_tot_precio_venta);
    //invoice line
    comprobante.Items.forEach((item) => {
        var i = 1;
        var valor_venta = (parseFloat(item.valor_unitario) * parseFloat(item.cantidad)).toFixed(2);
        var items = xml.ele('cac:InvoiceLine');
        items.ele('cbc:ID', i);
        items.ele('cbc:InvoicedQuantity', { 'unitCode': 'GLL', 'unitCodeListAgencyName': 'United Nations Economic Commission for Europe', 'unitCodeListID': 'UN/ECE rec 20' }, item.cantidad);
        items.ele('cbc:LineExtensionAmount', { 'currencyID': 'PEN' }, valor_venta);
        var pricing_reference = items.ele('cac:PricingReference');
        var alternative_condition = pricing_reference.ele('cac:AlternativeConditionPrice');
        alternative_condition.ele('cbc:PriceAmount', { 'currencyID': 'PEN' }, item.precio_unitario);
        alternative_condition.ele('cbc:PriceTypeCode', { 'listAgencyName': 'PE:SUNAT', 'listName': 'Tipo de Precio', 'listURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo16' }, '01');
        var tax_total = items.ele('cac:TaxTotal');
        tax_total.ele('cbc:TaxAmount', { 'currencyID': 'PEN' }, item.igv);
        var tax_subtotal = tax_total.ele('cac:TaxSubtotal');
        tax_subtotal.ele('cbc:TaxableAmount', { 'currencyID': 'PEN' }, valor_venta);
        tax_subtotal.ele('cbc:TaxAmount', { 'currencyID': 'PEN' }, item.igv);
        var tax_category = tax_subtotal.ele('cac:TaxCategory');
        tax_category.ele('cbc:ID', { 'schemeAgencyName': 'United Nations Economic Commission for Europe', 'schemeID': 'UN/ECE 5305', 'schemeName': 'Tax Category Identifier' }, 'S');
        tax_category.ele('cbc:Percent', '18.00');
        tax_category.ele('cbc:TaxExemptionReasonCode', { 'listAgencyName': 'PE:SUNAT', 'listName': 'Afectacion del IGV', 'listURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo07' }, 10);
        var tax_scheme = tax_category.ele('cac:TaxScheme');
        tax_scheme.ele('cbc:ID', { 'schemeAgencyName': 'PE:SUNAT', 'schemeName': 'Codigo de tributos', 'schemeURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo05' }, 1000);
        tax_scheme.ele('cbc:Name', 'IGV');
        tax_scheme.ele('cbc:TaxTypeCode', 'VAT');
        var comp_item = items.ele('cac:Item');
        comp_item.ele('cbc:Description', item.descripcion);
        comp_item.ele('cac:SellersItemIdentification').ele('cbc:ID', item.codigo_producto);
        var additional_prop = comp_item.ele('cac:AdditionalItemProperty');
        additional_prop.ele('cbc:Name', 'PLACA');
        additional_prop.ele('cbc:NameCode', { 'listAgencyName': 'PE:SUNAT', 'listName': 'Propiedad del item', 'listURI': 'urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo55' }, 5010);
        additional_prop.ele('cbc:Value', item.placa);
        var price = items.ele('cac:Price');
        price.ele('cbc:PriceAmount', { 'currencyID': 'PEN' }, item.valor_unitario);
    });
    return xml.end({ pretty: true });
};
exports.makeXMLFactura = makeXMLFactura;
//# sourceMappingURL=xml-builder.js.map