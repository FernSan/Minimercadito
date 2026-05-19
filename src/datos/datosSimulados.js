export const PRODUCTOS_INICIALES = [
    { id: 1, nombre: "Galletitas Lincoln", ean: "7790040006000", categoria: "Galletitas y Snacks", stock: 48, minimo: 20, precio: 1500, estado: "correcto" },
    { id: 2, nombre: "Coca-Cola 1.5L", ean: "7790895000119", categoria: "Bebidas", stock: 12, minimo: 24, precio: 2100, estado: "bajo" },
    { id: 3, nombre: "Leche La Serenísima 1L", ean: "7791337001139", categoria: "Lácteos", stock: 0, minimo: 15, precio: 980, estado: "agotado" },
    { id: 4, nombre: "Arroz Gallo oro 1kg", ean: "7790337001228", categoria: "Almacén", stock: 67, minimo: 30, precio: 1350, estado: "correcto" },
    { id: 5, nombre: "Aceite Cocinero 900ml", ean: "7791337009841", categoria: "Almacén", stock: 8, minimo: 12, precio: 3200, estado: "bajo" },
];

export const FACTURAS_INICIALES = [
    { id: "FAC-0002132", cliente: "Consumidor Final", tipo: "Factura B", total: 1500, hora: "10:15", estado: "aprobado" },
];

export const GASTOS_INICIALES = [
    { id: "GAS-88123", proveedor: "Distribuidora Arcor", concepto: "Compra Mercadería", total: 45000, fecha: "Ayer, 16:30", estado: "pagado" },
];