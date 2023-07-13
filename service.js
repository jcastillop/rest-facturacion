var Service = require("node-windows").Service;

// Create a new service object
var svc = new Service({
  name: "RESTFACTURACION",
  description: "Servidor rest de fuelhub para facturacion",
  script:
    "D:\\SolucionesOP\\FacturacionOP\\Fuentes\\rest-facturacion\\dist\\app.js",
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  svc.start();
});

svc.install();
