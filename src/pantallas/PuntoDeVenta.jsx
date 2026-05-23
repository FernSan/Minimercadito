import React, { useState } from "react";
import { Icono } from "../componentes/Icono.jsx";
import { iconos } from "../componentes/listaIconos.js";

export function PuntoDeVenta({ productos, onFinalizarVenta }) {
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [metodoPago, setMetodoPago] = useState("efectivo");

    // ── NUEVO ESTADO PARA CONTROLAR LAS SUGERENCIAS ──
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

    // Filtrar productos candidatos en base a lo que escribe el usuario (mínimo 1 letra)
    const sugerenciasFiltradas = busqueda.trim() === ""
        ? []
        : productos.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.ean.includes(busqueda)
        );

    // Función modificada para agregar un producto directamente desde el catálogo
    const agregarProductoAlCarrito = (producto) => {
        if (producto.stock === 0) {
            alert("¡Atención! Este producto no cuenta con unidades disponibles en stock.");
            return;
        }

        const existeEnCarrito = carrito.find((item) => item.id === producto.id);
        if (existeEnCarrito) {
            setCarrito(
                carrito.map((item) =>
                    item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                )
            );
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
        setBusqueda(""); // Limpiar buscador
        setMostrarSugerencias(false); // Ocultar sugerencias
    };

    // Manejar el "Enter" clásico del formulario
    const manejarSubmitBuscador = (e) => {
        if (e) e.preventDefault();
        if (!busqueda.trim()) return;

        // Si hay candidatos, tomamos el primero de la lista para agilizar
        if (sugerenciasFiltradas.length > 0) {
            agregarProductoAlCarrito(sugerenciasFiltradas[0]);
        } else {
            alert("Producto no encontrado en el catálogo.");
        }
    };

    const actualizarCantidad = (id, cambio) => {
        setCarrito(
            carrito.map((item) => {
                if (item.id === id) {
                    const nuevaCant = item.cantidad + cambio;
                    const productoOriginal = productos.find((p) => p.id === id);
                    if (nuevaCant > productoOriginal.stock) {
                        alert(`Límite alcanzado. Solo quedan ${productoOriginal.stock} unidades disponibles.`);
                        return item;
                    }
                    return { ...item, cantidad: Math.max(1, nuevaCant) };
                }
                return item;
            })
        );
    };

    const eliminarArticulo = (id) => setCarrito(carrito.filter((item) => item.id !== id));
    const totalCarrito = carrito.reduce((ac, act) => ac + act.precio * act.cantidad, 0);

    const procesarCobro = () => {
        if (carrito.length === 0) return;
  
        // Pasamos el carrito, el total y el metodo de pago seleccionado
        onFinalizarVenta(carrito, totalCarrito, metodoPago);
  
        alert("¡Venta procesada con éxito! El inventario ha sido actualizado.");
        setCarrito([]); 
    };

    return (
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Formulario Buscador con Autocompletado */}
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", position: "relative" }}>
                    <form onSubmit={manejarSubmitBuscador} style={{ display: "flex", gap: 10 }}>
                        <div style={{ flex: 1, position: "relative" }}>
                            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
                                <Icono d={iconos.buscar} tamano={16} grosorTrazo={2} />
                            </span>
                            <input
                                value={busqueda}
                                onChange={(e) => {
                                    setBusqueda(e.target.value);
                                    setMostrarSugerencias(true);
                                }}
                                onFocus={() => setMostrarSugerencias(true)}
                                // Pequeño retraso al desnfocar para permitir hacer clic en la sugerencia antes de que se oculte
                                onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                                placeholder="Escriba 'Coca', 'Lincoln' o el EAN..."
                                style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", color: "#374151" }}
                            />
                        </div>
                        <button type="submit" style={{ display: "flex", alignItems: "center", gap: 8, background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe", borderRadius: 10, padding: "0 18px", fontWeight: 700, cursor: "pointer" }}>
                            Añadir
                        </button>
                    </form>

                    {/* ── LISTA FLOTANTE DE SUGERENCIAS ASOCIADA AL BUSCADOR ── */}
                    {mostrarSugerencias && sugerenciasFiltradas.length > 0 && (
                        <div style={{
                            position: "absolute", top: "calc(100% - 8px)", left: 20, width: "calc(100% - 148px)",
                            background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                            zIndex: 50, maxHeight: 220, overflowY: "auto", marginTop: 12
                        }}>
                            {sugerenciasFiltradas.map((prod) => (
                                <div
                                    key={prod.id}
                                    onClick={() => agregarProductoAlCarrito(prod)}
                                    style={{
                                        padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
                                        cursor: "pointer", borderBottom: "1px solid #f3f4f6", transition: "background 0.15s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#f0f6ff"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                                >
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{prod.nombre}</div>
                                        <div style={{ fontSize: 11, color: "#9ca3af" }}>EAN: {prod.ean} • Stock: {prod.stock} u.</div>
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb" }}>
                                        ${prod.precio.toLocaleString("es-AR")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tabla Detalle Venta */}
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1.2fr 1fr 40px", padding: "12px 24px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
                        {["DESCRIPCIÓN", "PRECIO", "CANTIDAD", "TOTAL", ""].map(h => (
                            <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", letterSpacing: 0.8 }}>{h}</span>
                        ))}
                    </div>
                    {carrito.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>La caja está vacía. Ingrese un artículo superior.</div>
                    ) : (
                        carrito.map(item => (
                            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1.2fr 1fr 40px", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #f3f4f6" }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{item.nombre}</div>
                                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.ean}</div>
                                </div>
                                <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>${item.precio.toLocaleString("es-AR")}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <button onClick={() => actualizarCantidad(item.id, -1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icono d={iconos.menos} tamano={10} trazo="#6b7280" grosorTrazo={3} />
                                    </button>
                                    <span style={{ fontSize: 14, fontWeight: 700, width: 20, textAlign: "center" }}>{item.cantidad}</span>
                                    <button onClick={() => actualizarCantidad(item.id, 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icono d={iconos.mas} tamano={10} trazo="#6b7280" grosorTrazo={3} />
                                    </button>
                                </div>
                                <span style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 700 }}>${(item.precio * item.cantidad).toLocaleString("es-AR")}</span>
                                <button onClick={() => eliminarArticulo(item.id)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 4 }}>
                                    <Icono d={iconos.basura} tamano={14} trazo="#ef4444" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Panel Cobros */}
            <div style={{ width: 320, background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Total a Cobrar</h3>
                    <p style={{ fontSize: 36, fontWeight: 900, color: "#1a1a2e", letterSpacing: -1 }}>${totalCarrito.toLocaleString("es-AR")},00</p>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: 0 }} />
                <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 8 }}>MÉTODO DE PAGO</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[{ id: "efectivo", label: "Efectivo" }, { id: "tarjeta", label: "Tarjeta Débito/Crédito" }, { id: "transferencia", label: "Transferencia / QR" }].map(m => (
                            <button key={m.id} onClick={() => setMetodoPago(m.id)} style={{
                                width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid", textAlign: "left", fontSize: 13, fontWeight: 600, cursor: "pointer",
                                background: metodoPago === m.id ? "#eff6ff" : "#fff", color: metodoPago === m.id ? "#2563eb" : "#4b5563", borderColor: metodoPago === m.id ? "#2563eb" : "#e5e7eb",
                            }}>{m.label}</button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={procesarCobro}
                    disabled={carrito.length === 0}
                    style={{ width: "100%", background: carrito.length === 0 ? "#cbd5e1" : "#22c55e", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: carrito.length === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: carrito.length === 0 ? "none" : "0 4px 12px rgba(34,197,94,0.2)" }}
                >
                    <Icono d={iconos.chequeo} tamano={16} trazo="#fff" grosorTrazo={2.5} /> Confirmar Venta
                </button>
            </div>
        </div>
    );
}