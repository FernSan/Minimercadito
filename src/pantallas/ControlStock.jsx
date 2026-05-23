import React, { useState } from "react";
import { Icono } from "../componentes/Icono.jsx";
import { iconos } from "../componentes/listaIconos.js";
import { EtiquetaEstado } from "../componentes/EtiquetaEstado.jsx";

export function ControlStock({ productos, setProductos }) {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // ── ESTADOS PARA EL MODAL DE NUEVO PRODUCTO ──
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [ean, setEan] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockInicial, setStockInicial] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");

  // 1. Filtrar las sugerencias en base a la búsqueda
  const sugerenciasFiltradas = busqueda.trim() === "" 
    ? [] 
    : productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        p.ean.includes(busqueda)
      );

  // 2. Modificar cantidades de productos (+ / -)
  const cambiarStockBotones = (id, cambio) => {
    setProductos(prev => prev.map(prod => {
      if (prod.id === id) {
        const nuevoStock = Math.max(0, prod.stock + cambio);
        return actualizarPropiedadesProducto(prod, nuevoStock);
      }
      return prod;
    }));
  };

  // ── NUEVA FUNCIÓN: ACTUALIZAR EL STOCK DIRECTAMENTE DESDE EL TECLADO ──
  const manejarEdicionDirectaStock = (id, valorTexto) => {
    // Si el usuario borra el campo por completo, lo dejamos en 0 temporalmente
    const nuevoStock = valorTexto === "" ? 0 : Math.max(0, parseInt(valorTexto, 10));
    
    setProductos(prev => prev.map(prod => {
      if (prod.id === id) {
        return actualizarPropiedadesProducto(prod, nuevoStock);
      }
      return prod;
    }));
  };

  // Función auxiliar para no repetir la lógica del cálculo de estado (Correcto, Bajo, Agotado)
  const actualizarPropiedadesProducto = (producto, nuevoStock) => {
    let nuevoEstado = "correcto";
    if (nuevoStock === 0) nuevoEstado = "agotado";
    else if (nuevoStock < producto.minimo) nuevoEstado = "bajo";

    return { ...producto, stock: nuevoStock, estado: nuevoEstado };
  };

  // 3. Crear un nuevo producto desde el formulario del modal
  const manejarGuardarProducto = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !ean.trim() || !precio || !stockInicial || !stockMinimo) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (productos.some(p => p.ean === ean.trim())) {
      alert("¡Error! Ya existe un producto registrado con ese mismo código EAN.");
      return;
    }

    const inicial = parseInt(stockInicial, 10);
    const minimo = parseInt(stockMinimo, 10);
    let estadoInicial = "correcto";
    if (inicial === 0) estadoInicial = "agotado";
    else if (inicial < minimo) estadoInicial = "bajo";

    const nuevoProd = {
      id: `PROD-${Math.floor(100 + Math.random() * 899)}`,
      nombre: nombre,
      ean: ean.trim(),
      precio: parseFloat(precio),
      stock: inicial,
      minimo: minimo,
      estado: estadoInicial
    };

    setProductos([nuevoProd, ...productos]);
    
    setNombre("");
    setEan("");
    setPrecio("");
    setStockInicial("");
    setStockMinimo("");
    setMostrarModal(false);

    alert("¡Producto añadido al catálogo correctamente!");
  };

  const seleccionarSugerencia = (nombreProd) => {
    setBusqueda(nombreProd);
    setMostrarSugerencias(false);
  };

  const productosVisibles = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.ean.includes(busqueda)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative" }}>
      
      {/* Barra de Herramientas: Buscador con Sugerencias + Botón Añadir */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", position: "relative" }}>
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
            onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
            placeholder="Buscar producto por nombre o código EAN..."
            style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", color: "#374151", boxSizing: "border-box" }}
          />

          {mostrarSugerencias && sugerenciasFiltradas.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, width: "100%",
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", zIndex: 50, maxHeight: 180, overflowY: "auto", marginTop: 6
            }}>
              {sugerenciasFiltradas.map(p => (
                <div 
                  key={p.id}
                  onClick={() => seleccionarSugerencia(p.nombre)}
                  style={{ padding: "10px 16px", cursor: "pointer", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#1a1a2e", fontWeight: 600 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f6ff"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  {p.nombre} <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: 11 }}>({p.ean})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => setMostrarModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 6px rgba(37,99,235,0.15)", height: "46px" }}
        >
          <Icono d={iconos.mas} tamano={14} trazo="#fff" grosorTrazo={2.5} /> Nuevo Producto
        </button>
      </div>

      {/* Tabla de Inventario Principal */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr 1.2fr 1.8fr 1.2fr 1.2fr", padding: "14px 24px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
          {["ID", "PRODUCTO / EAN", "PRECIO", "CANTIDAD ACTUAL", "MÍNIMO", "ESTADO"].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", letterSpacing: 0.8 }}>{h}</span>
          ))}
        </div>

        {productosVisibles.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No se encontraron productos que coincidan.</div>
        ) : (
          productosVisibles.map(prod => (
            <div key={prod.id} style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr 1.2fr 1.8fr 1.2fr 1.2fr", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>{prod.id}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{prod.nombre}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>EAN: {prod.ean}</div>
              </div>
              <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>${prod.precio.toLocaleString("es-AR")}</span>
              
              {/* ── SECCIÓN MODIFICADA: ENTRADA DIRECTA + BOTONES ── */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => cambiarStockBotones(prod.id, -1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, justifyContent: "center" }}>
                  <Icono d={iconos.menos} tamano={9} trazo="#6b7280" grosorTrazo={3} />
                </button>
                
                <input 
                  type="number"
                  min="0"
                  value={prod.stock}
                  onChange={(e) => manejarEdicionDirectaStock(prod.id, e.target.value)}
                  style={{
                    width: "55px", paddingTop: "5px", paddingBottom: "5px",
                    borderRadius: 6, border: "1.5px solid #e5e7eb", textAlign: "center",
                    fontSize: 13, fontWeight: 800, color: prod.stock === 0 ? "#ef4444" : "#1a1a2e",
                    background: "#f9fafb", outline: "none", WebkitAppearance: "none", margin: 0
                  }}
                />
                
                <button onClick={() => cambiarStockBotones(prod.id, 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, justifyContent: "center" }}>
                  <Icono d={iconos.mas} tamano={9} trazo="#6b7280" grosorTrazo={3} />
                </button>
                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginLeft: 2 }}>u.</span>
              </div>

              <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{prod.minimo} u.</span>
              <EtiquetaEstado estado={prod.estado} />
            </div>
          ))
        )}
      </div>

      {/* Modal Flotante: Registrar Nuevo Producto */}
      {mostrarModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", width: 420, padding: "28px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: 20 }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e" }}>Dar de Alta Producto</h3>
              <button onClick={() => setMostrarModal(false)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex" }}>
                <Icono d={iconos.cerrar} tamano={18} trazo="#6b7280" grosorTrazo={2.5} />
              </button>
            </div>

            <form onSubmit={manejarGuardarProducto} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 6 }}>NOMBRE DEL PRODUCTO *</label>
                <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Yerba Mate Taragüí 1kg" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 6 }}>CÓDIGO DE BARRAS / EAN *</label>
                <input type="text" required value={ean} onChange={e => setEan(e.target.value)} placeholder="Ej: 7791234567890" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 6 }}>PRECIO DE VENTA ($) *</label>
                <input type="number" required min="0.1" step="0.01" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="0.00" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 6 }}>STOCK INICIAL *</label>
                  <input type="number" required min="0" value={stockInicial} onChange={e => setStockInicial(e.target.value)} placeholder="0" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", display: "block", marginBottom: 6 }}>STOCK MÍNIMO *</label>
                  <input type="number" required min="1" value={stockMinimo} onChange={e => setStockMinimo(e.target.value)} placeholder="Ej: 5" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancelar</button>
                <button type="submit" style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}