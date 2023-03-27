"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signXml = void 0;
const signXml = (xml) => {
    var SignedXml = require('xml-crypto').SignedXml, fs = require('fs');
    var sig = new SignedXml();
    sig.signingKey = fs.readFileSync('D:\\SolucionesOP\\FacturacionOP\\Fuentes\\rest-facturacion\\data\\pem\\certificado.pem');
    // not working:
    /*
    sig.canonicalizationAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
    sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1"
    sig.addReference(xpath, ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"])
  */
    // working:
    // sig.addReference(xpath)
    sig.computeSignature(xml);
    return sig.getSignedXml();
    //fs.writeFileSync(dest, sig.getSignedXml())
};
exports.signXml = signXml;
//# sourceMappingURL=digital-signature.js.map