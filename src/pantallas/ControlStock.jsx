import React, { useState } from "react";
import { Icono } from "../componentes/Icono.jsx";
import { iconos } from "../componentes/listaIconos.js";
import { EtiquetaEstado } from "../componentes/EtiquetaEstado.jsx";
import { BarraStock } from "../componentes/BarraStock.jsx";
//import { PRODUCTOS_INICIALES } from "../datos/datosSimulados.js";

export function ControlStock({ productos }) {
    const [busqueda, setBusqueda] = useState("");
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>Productos en catálogo</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#2563eb", lineHeight: 1.1 }}>1.248</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>+12 esta semana</p>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>Actualizados hoy</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#16a34a", lineHeight: 1.1 }}>34</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Último: hace 18 min</p>
                </div>
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>Pendientes de revisión</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#dc2626", lineHeight: 1.1 }}>7</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Precio sin actualizar +30 días</p>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>Consulta Ágil de Precios</h2>
                <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>Buscá por nombre, código EAN o escaneá un producto</p>
                <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, position: "relative" }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                            <Icono d={iconos.buscar} tamano={16} grosorTrazo={2} />
                        </span>
                        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Escanee o ingrese producto..." style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", color: "#374151", background: "#f9fafb", boxSizing: "border-box" }} />
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: 8, background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe", borderRadius: 10, padding: "0 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        <Icono d={iconos.escanear} tamano={15} trazo="#2563eb" grosorTrazo={2} /> Escanear
                    </button>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr", padding: "12px 24px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                    {["PRODUCTO", "CATEGORÍA", "STOCK", "MÍNIMO", "ESTADO"].map(h => (
                        <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", letterSpacing: 0.8 }}>{h}</span>
                    ))}
                </div>
                {productos.map(p => (
                    <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #f3f4f6" }}>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{p.nombre}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af" }}>EAN: {p.ean}</div>
                        </div>
                        <span style={{ fontSize: 12, color: "#6b7280" }}>{p.categoria}</span>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>{p.stock} u.</div>
                            <BarraStock stock={p.stock} minimo={p.minimo} />
                        </div>
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>mín. {p.minimo} u.</span>
                        <EtiquetaEstado estado={p.estado} />
                    </div>
                ))}
            </div>
        </div>
    );
}