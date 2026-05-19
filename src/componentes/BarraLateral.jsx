import React from "react";
import { Icono } from "../componentes/Icono.jsx";
import { iconos } from "../componentes/listaIconos.js";

export function BarraLateral({ moduloActual, setModuloActual }) {
    const modulos = [
        { id: "inventario", nombre: "Control de Stock", icono: iconos.stock },
        { id: "caja", nombre: "Punto de Venta (POS)", icono: iconos.carrito },
        { id: "contabilidad", nombre: "Facturación y Gastos", icono: iconos.factura },
    ];

    return (
        <aside style={{ width: 240, minHeight: "100vh", background: "#fff", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", padding: "0 0 24px 0", boxShadow: "2px 0 8px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "20px 20px 8px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                    <Icono d={iconos.tienda} tamano={18} trazo="#fff" />
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>MiniMarket</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>Sistema de Gestión</div>
                </div>
            </div>
            <div style={{ padding: "20px 12px 8px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: 1, marginBottom: 8, paddingLeft: 8 }}>MÓDULOS</div>
                {modulos.map(m => {
                    const estaActivo = moduloActual === m.id;
                    return (
                        <div key={m.id} onClick={() => setModuloActual(m.id)} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 12px", borderRadius: 8, marginBottom: 2, cursor: "pointer",
                            background: estaActivo ? "#eff6ff" : "transparent",
                            color: estaActivo ? "#2563eb" : "#6b7280",
                            fontWeight: estaActivo ? 700 : 500, fontSize: 13, transition: "background .15s",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Icono d={m.icono} tamano={16} trazo={estaActivo ? "#2563eb" : "#9ca3af"} />
                                {m.nombre}
                            </div>
                            {estaActivo && <Icono d={iconos.chevron} tamano={14} trazo="#2563eb" />}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}