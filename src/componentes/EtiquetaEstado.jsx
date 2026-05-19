import React from "react";

export function EtiquetaEstado({ estado }) {
    const mapaEstados = {
        correcto: { etiqueta: "En stock", fondo: "#f0fdf4", color: "#16a34a" },
        bajo: { etiqueta: "Stock bajo", fondo: "#fffbeb", color: "#d97706" },
        agotado: { etiqueta: "Sin stock", fondo: "#fef2f2", color: "#dc2626" },
        aprobado: { etiqueta: "Emitida", fondo: "#f0fdf4", color: "#16a34a" },
        pagado: { etiqueta: "Pagado", fondo: "#e0f2fe", color: "#0369a1" },
        pendiente: { etiqueta: "Pendiente", fondo: "#fffbeb", color: "#d97706" },
    };

    const e = mapaEstados[estado] || { etiqueta: estado, fondo: "#f3f4f6", color: "#374151" };

    return (
        <span style={{ fontSize: 11, fontWeight: 700, background: e.fondo, color: e.color, borderRadius: 20, padding: "3px 10px", display: "inline-block" }}>
            {e.etiqueta}
        </span>
    );
}