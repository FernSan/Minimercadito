import React, { useState } from "react";
import { BarraLateral } from "./componentes/BarraLateral.jsx";
import { ControlStock } from "./pantallas/ControlStock.jsx";
import { PuntoDeVenta } from "./pantallas/PuntoDeVenta.jsx";
import { Facturacion } from "./pantallas/Facturacion.jsx";
import { PRODUCTOS_INICIALES, FACTURAS_INICIALES, GASTOS_INICIALES } from "./datos/datosSimulados.js";

export default function App() {
    const [moduloActual, setModuloActual] = useState("caja");
    const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
    const [facturas, setFacturas] = useState(FACTURAS_INICIALES);
    const [gastos, setGastos] = useState(GASTOS_INICIALES);

    const cadenaFecha = `Hoy, ${new Date().toLocaleDateString("es-AR")}`;

    const registrarNuevaVenta = (itemsCarrito, totalVenta) => {
        setProductos(prevProductos =>
            prevProductos.map(prod => {
                const itemVendido = itemsCarrito.find(item => item.id === prod.id);
                if (itemVendido) {
                    const nuevoStock = Math.max(0, prod.stock - itemVendido.cantidad);
                    let nuevoEstado = "correcto";
                    if (nuevoStock === 0) nuevoEstado = "agotado";
                    else if (nuevoStock < prod.minimo) nuevoEstado = "bajo";

                    return { ...prod, stock: nuevoStock, estado: nuevoEstado };
                }
                return prod;
            })
        );

        const ahora = new Date();
        const horaStr = `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`;
        const nuevaFactura = {
            id: `FAC-000${Math.floor(1000 + Math.random() * 9000)}`,
            cliente: "Consumidor Final",
            tipo: "Factura B",
            total: totalVenta,
            hora: horaStr,
            estado: "aprobado"
        };

        setFacturas(prevFacturas => [nuevaFactura, ...prevFacturas]);
    };

    const renderizarTitulo = () => {
        switch (moduloActual) {
            case "inventario": return "Control de Stock";
            case "caja": return "Terminal Punto de Venta (POS)";
            case "contabilidad": return "Módulo de Facturación y Gastos";
            default: return "Sistema";
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            <BarraLateral moduloActual={moduloActual} setModuloActual={setModuloActual} />

            <main style={{ flex: 1, overflow: "auto" }}>
                <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "14px 32px", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9ca3af" }}>
                        <span>Sistema</span>
                        <span>/</span>
                        <span style={{ color: "#2563eb", fontWeight: 600 }}>{renderizarTitulo()}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", color: "#16a34a", padding: "6px 14px", borderRadius: 20 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                            <span style={{ fontSize: 12, fontWeight: 700 }}>Terminal Online</span>
                        </div>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>{cadenaFecha}</span>
                    </div>
                </div>

                <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
                    {moduloActual === "inventario" && <ControlStock productos={productos} />}
                    {moduloActual === "caja" && <PuntoDeVenta productos={productos} onFinalizarVenta={registrarNuevaVenta} />}
                    {moduloActual === "contabilidad" && <Facturacion facturas={facturas} gastos={gastos} setGastos={setGastos} />}
                </div>
            </main>
        </div>
    );
}