import React, { useState } from "react";
import { Icono } from "../componentes/Icono.jsx";
import { iconos } from "../componentes/listaIconos.js";
import { EtiquetaEstado } from "../componentes/EtiquetaEstado.jsx";

export function Facturacion({ facturas, gastos, setGastos }) {
    const [pestañaActiva, setPestañaActiva] = useState("ventas");

    // ── ESTADOS PARA EL MODAL DE GASTOS ──
    const [mostrarModal, setMostrarModal] = useState(false);
    const [proveedor, setProveedor] = useState("");
    const [concepto, setConcepto] = useState("");
    const [monto, setMonto] = useState("");
    const [estadoPago, setEstadoPago] = useState("pendiente");

    // Calcular totales reales sobre las filas dinámicas
    const totalVentasHoy = facturas.reduce((acc, f) => acc + f.total, 0);
    const totalGastosHoy = gastos.reduce((acc, g) => acc + (g.estado === "pagado" ? g.total : 0), 0);
    const totalPendienteGastos = gastos.reduce((acc, g) => acc + (g.estado === "pendiente" ? g.total : 0), 0);

    // Función para procesar el formulario del nuevo gasto
    const manejarGuardarGasto = (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!proveedor.trim() || !concepto.trim() || !monto) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

        // Crear el nuevo objeto de gasto
        const nuevoGasto = {
            id: `GAS-${Math.floor(80000 + Math.random() * 19999)}`,
            proveedor: proveedor,
            concepto: concepto,
            total: parseFloat(monto),
            fecha: "Hoy, " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
            estado: estadoPago
        };

        // Actualizar la lista global de gastos (vía props de App.jsx)
        setGastos([nuevoGasto, ...gastos]);

        // Limpiar el formulario y cerrar el modal
        setProveedor("");
        setConcepto("");
        setMonto("");
        setEstadoPago("pendiente");
        setMostrarModal(false);

        alert("¡Gasto registrado y contabilizado con éxito!");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28, position: "relative" }}>

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
                        <button
                            onClick={() => setMostrarModal(true)}
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 6px rgba(37,99,235,0.15)" }}
                        >
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

            {/* ── VENTANA MODAL FLOTANTE (REFORZADA CON INTERFAZ DE CAPA) ── */}
            {mostrarModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{
                        background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
                        width: 420, padding: "28px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                        display: "flex", flexDirection: "column", gap: 20
                    }}>
                        {/* Cabecera del Modal */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e" }}>Nueva Factura de Gasto</h3>
                            <button
                                onClick={() => setMostrarModal(false)}
                                style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex", padding: 4 }}
                            >
                                <Icono d={iconos.cerrar} tamano={18} trazo="#6b7280" grosorTrazo={2.5} />
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={manejarGuardarGasto} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 6 }}>PROVEEDOR *</label>
                                <input
                                    type="text" required value={proveedor} onChange={e => setProveedor(e.target.value)}
                                    placeholder="Ej: Distribuidora Arcor, Logística Pepsi..."
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#374151", outline: "none", boxSizing: "border-box" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 6 }}>CONCEPTO / DETALLE *</label>
                                <input
                                    type="text" required value={concepto} onChange={e => setConcepto(e.target.value)}
                                    placeholder="Ej: Reposición de chocolates, Pago de luz..."
                                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#374151", outline: "none", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 6 }}>MONTO TOTAL ($) *</label>
                                    <input
                                        type="number" required min="1" value={monto} onChange={e => setMonto(e.target.value)}
                                        placeholder="0.00"
                                        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#374151", outline: "none", boxSizing: "border-box" }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 6 }}>ESTADO INICIAL</label>
                                    <select
                                        value={estadoPago} onChange={e => setEstadoPago(e.target.value)}
                                        style={{ width: "100%", padding: "10px 10px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#374151", outline: "none", background: "#fff", cursor: "pointer", height: "40px" }}
                                    >
                                        <option value="pagado">Pagado</option>
                                        <option value="pendiente">Pendiente</option>
                                    </select>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div style={{ display: "flex", gap: 10, marginTop: 8, justifyContent: "flex-end" }}>
                                <button
                                    type="button" onClick={() => setMostrarModal(false)}
                                    style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 6px rgba(34,197,94,0.15)" }}
                                >
                                    Guardar Factura
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}