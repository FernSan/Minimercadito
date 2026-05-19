import React, { useState } from "react";
import { Icono } from "../componentes/Icono.jsx";
import { iconos } from "../componentes/listaIconos.js";
import { EtiquetaEstado } from "../componentes/EtiquetaEstado.jsx";

export function Facturacion({ facturas, gastos, setGastos }) {
    const [pestañaActiva, setPestañaActiva] = useState("ventas");

    // Calcular totales reales sobre las filas dinámicas enviadas por App.jsx
    const totalVentasHoy = facturas.reduce((acc, f) => acc + f.total, 0);
    const totalGastosHoy = gastos.reduce((acc, g) => acc + (g.estado === "pagado" ? g.total : 0), 0);
    const totalPendienteGastos = gastos.reduce((acc, g) => acc + (g.estado === "pendiente" ? g.total : 0), 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Tarjetas de Indicadores Contables */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>Facturado Hoy (Ingresos)</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#16a34a", lineHeight: 1.1 }}>${totalVentasHoy.toLocaleString("es-AR")}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{facturas.length} comprobantes emitidos</p>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>Egresos / Gastos Hoy</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#dc2626", lineHeight: 1.1 }}>${totalGastosHoy.toLocaleString("es-AR")}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Proveedores y reabastecimiento</p>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>Gastos Pendientes de Pago</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#d97706", lineHeight: 1.1 }}>${totalPendienteGastos.toLocaleString("es-AR")}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Cuentas corrientes de proveedores</p>
                </div>
            </div>

            {/* Selectores de Pestañas */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "12px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", gap: 8 }}>
                <button onClick={() => setPestañaActiva("ventas")} style={{
                    padding: "10px 18px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .15s",
                    background: pestañaActiva === "ventas" ? "#eff6ff" : "transparent",
                    color: pestañaActiva === "ventas" ? "#2563eb" : "#6b7280"
                }}>
                    <Icono d={iconos.factura} tamano={15} trazo={pestañaActiva === "ventas" ? "#2563eb" : "#9ca3af"} /> Histórico de Ventas
                </button>
                <button onClick={() => setPestañaActiva("gastos")} style={{
                    padding: "10px 18px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .15s",
                    background: pestañaActiva === "gastos" ? "#eff6ff" : "transparent",
                    color: pestañaActiva === "gastos" ? "#2563eb" : "#6b7280"
                }}>
                    <Icono d={iconos.camion} tamano={15} trazo={pestañaActiva === "gastos" ? "#2563eb" : "#9ca3af"} /> Gastos de Proveedores
                </button>
            </div>

            {/* Tabla: Historial de Ventas */}
            {pestañaActiva === "ventas" && (
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 1fr 1fr", padding: "12px 24px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                        {["COMPROBANTE", "CLIENTE", "TIPO", "TOTAL", "ESTADO AFIP"].map(h => (
                            <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", letterSpacing: 0.8 }}>{h}</span>
                        ))}
                    </div>
                    {facturas.map(fac => (
                        <div key={fac.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr 1fr 1fr", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #f3f4f6" }}>
                            <div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{fac.id}</span>
                                <div style={{ fontSize: 11, color: "#9ca3af" }}>Hora: {fac.hora}</div>
                            </div>
                            <span style={{ fontSize: 13, color: "#4b5563" }}>{fac.cliente}</span>
                            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{fac.tipo}</span>
                            <span style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 700 }}>${fac.total.toLocaleString("es-AR")}</span>
                            <EtiquetaEstado estado={fac.estado} />
                        </div>
                    ))}
                </div>
            )}

            {/* Tabla: Gastos de Proveedores */}
            {pestañaActiva === "gastos" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                            <Icono d={iconos.mas} tamano={14} trazo="#fff" grosorTrazo={2.5} /> Registrar Factura de Compra
                        </button>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.5fr 1fr 1fr", padding: "12px 24px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                            {["NRO COMPRA", "PROVEEDOR", "CONCEPTO", "MONTO", "ESTADO PAGO"].map(h => (
                                <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", letterSpacing: 0.8 }}>{h}</span>
                            ))}
                        </div>
                        {gastos.map(gas => (
                            <div key={gas.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.5fr 1fr 1fr", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #f3f4f6" }}>
                                <div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{gas.id}</span>
                                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{gas.fecha}</div>
                                </div>
                                <span style={{ fontSize: 13, color: "#4b5563", fontWeight: 600 }}>{gas.proveedor}</span>
                                <span style={{ fontSize: 12, color: "#6b7280" }}>{gas.concepto}</span>
                                <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 700 }}>${gas.total.toLocaleString("es-AR")}</span>
                                <EtiquetaEstado estado={gas.estado} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}