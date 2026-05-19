import React from "react";

export function BarraStock({ stock, minimo }) {
    const porcentaje = minimo > 0 ? Math.min((stock / (minimo * 3)) * 100, 100) : 100;
    const color = stock === 0 ? "#ef4444" : stock < minimo ? "#f59e0b" : "#22c55e";

    return (
        <div style={{ background: "#f3f4f6", borderRadius: 4, height: 5, width: 80, overflow: "hidden", marginTop: 4 }}>
            <div style={{ height: "100%", width: `${porcentaje}%`, background: color, borderRadius: 4, transition: "width .4s" }} />
        </div>
    );
}