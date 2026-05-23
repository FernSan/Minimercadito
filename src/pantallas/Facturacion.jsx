import React, { useState } from "react";
import { Icono } from "../componentes/Icono.jsx";
import { iconos } from "../componentes/listaIconos.js";
import { EtiquetaEstado } from "../componentes/EtiquetaEstado.jsx";

export function Facturacion({ facturas, gastos, setGastos, productos, setProductos, onAnularVenta }) {
  const [pestañaActiva, setPestañaActiva] = useState("ventas");
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [proveedor, setProveedor] = useState("");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [estadoPago, setEstadoPago] = useState("pendiente");
  const [fechaFactura, setFechaFactura] = useState(new Date().toISOString().split('T')[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  // ── ESTADOS COMPRA PROVEEDOR AVANZADA ──
  const [esProductoNuevo, setEsProductoNuevo] = useState(false);
  const [productoExistenteSeleccionado, setProductoExistenteSeleccionado] = useState("");
  const [nuevoNombreProducto, setNuevoNombreProducto] = useState("");
  const [nuevoEan, setNuevoEan] = useState("");
  const [cantidadComprada, setCantidadComprada] = useState("1");

  // REPARADO: Se reincorporó el signo + para que compute de forma correcta
  const totalVentasHoy = facturas.reduce((acc, f) => acc + (f.estado === "anulado" ? 0 : f.total), 0);
  const totalGastosHoy = gastos.reduce((acc, g) => acc + (g.estado === "pagado" ? g.total : 0), 0);
  const totalPendienteGastos = gastos.reduce((acc, g) => acc + (g.estado === "pendiente" ? g.total : 0), 0);

  const manejarPagarGasto = (id, proveedor, total) => {
    const seguro = window.confirm(`⚠️ ¿Confirmar pago al proveedor ${proveedor} por $${total.toLocaleString("es-AR")}?`);
    if (seguro) {
      setGastos(prev => prev.map(g => (g.id === id ? { ...g, estado: "pagado", vencimiento: "Liquidado" } : g)));
    }
  };

  const manejarGuardarGasto = (e) => {
    e.preventDefault();

    if (!proveedor.trim() || !monto || !fechaFactura) {
      alert("Por favor, rellene los campos obligatorios.");
      return;
    }

    let productoFinalNombre = "";
    const cantidadInt = parseInt(cantidadComprada, 10) || 1;

    if (esProductoNuevo) {
      if (!nuevoNombreProducto.trim() || !nuevoEan.trim()) {
        alert("Complete el Nombre y EAN del nuevo producto.");
        return;
      }
      productoFinalNombre = nuevoNombreProducto.trim();

      const nuevoProdCat = {
        id: `PROD-${Math.floor(100 + Math.random() * 899)}`,
        nombre: productoFinalNombre,
        ean: nuevoEan.trim(),
        precio: (parseFloat(monto) / cantidadInt) * 1.4, 
        stock: cantidadInt, 
        minimo: 5,
        estado: "correcto"
      };
      setProductos(prev => [nuevoProdCat, ...prev]);
    } else if (productoExistenteSeleccionado) {
      productoFinalNombre = productoExistenteSeleccionado;
      
      setProductos(prev => prev.map(p => {
        if (p.nombre === productoExistenteSeleccionado) {
          const nuevoStock = p.stock + cantidadInt;
          return { ...p, stock: nuevoStock, estado: nuevoStock >= p.minimo ? "correcto" : "bajo" };
        }
        return p;
      }));
    }

    const fFacturaFormateada = fechaFactura.split("-").reverse().join("/");
    const fVencimientoFormateada = fechaVencimiento ? fechaVencimiento.split("-").reverse().join("/") : "N/A";

    const nuevoGasto = {
      id: `GAS-${Math.floor(80000 + Math.random() * 19999)}`,
      proveedor: proveedor,
      concepto: productoFinalNombre ? `${concepto} [${cantidadInt} u. de ${productoFinalNombre}]` : concepto,
      productoAsociado: productoFinalNombre || "Gasto General",
      total: parseFloat(monto),
      fecha: fFacturaFormateada,
      vencimiento: estadoPago === "pendiente" ? fVencimientoFormateada : "Liquidado",
      estado: estadoPago
    };

    setGastos([nuevoGasto, ...gastos]);

    setProveedor(""); setConcepto(""); setMonto(""); setProductoExistenteSeleccionado("");
    setNuevoNombreProducto(""); setNuevoEan(""); setCantidadComprada("1"); setEsProductoNuevo(false);
    setMostrarModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      
      {/* Tarjetas Indicadoras */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "18px 22px" }}>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Facturado Hoy (Ingresos)</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: "#16a34a" }}>${totalVentasHoy.toLocaleString("es-AR")}</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "18px 22px" }}>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Egresos / Gastos Hoy</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: "#dc2626" }}>${totalGastosHoy.toLocaleString("es-AR")}</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "18px 22px" }}>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Gastos Pendientes</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: "#d97706" }}>${totalPendienteGastos.toLocaleString("es-AR")}</p>
        </div>
      </div>

      {/* Selectores */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: "12px 16px", display: "flex", gap: 8 }}>
        <button onClick={() => setPestañaActiva("ventas")} style={{ padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: pestañaActiva === "ventas" ? "#eff6ff" : "transparent", color: pestañaActiva === "ventas" ? "#2563eb" : "#6b7280" }}>
          Histórico de Ventas
        </button>
        <button onClick={() => setPestañaActiva("gastos")} style={{ padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: pestañaActiva === "gastos" ? "#eff6ff" : "transparent", color: pestañaActiva === "gastos" ? "#2563eb" : "#6b7280" }}>
          Gastos de Proveedores
        </button>
      </div>

      {/* Historial Ventas */}
      {pestañaActiva === "ventas" && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 0.8fr 1fr 1fr 1fr", padding: "12px 24px", background: "#f9fafb", fontSize: 10, fontWeight: 800, color: "#9ca3af" }}>
            <span>COMPROBANTE</span><span>ARTÍCULOS VENDIDOS</span><span>TIPO</span><span>TOTAL</span><span>AFIP</span><span>ACCIONES</span>
          </div>
          {facturas.map(fac => (
            <div key={fac.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 0.8fr 1fr 1fr 1fr", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #f3f4f6", opacity: fac.estado === "anulado" ? 0.5 : 1 }}>
              <div><span style={{ fontSize: 13, fontWeight: 700 }}>{fac.id}</span><div style={{ fontSize: 11, color: "#9ca3af" }}>{fac.hora}</div></div>
              <span style={{ fontSize: 12, color: "#4b5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fac.items || "Venta General"}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{fac.tipo}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: fac.estado === "anulado" ? "#9ca3af" : "#1a1a2e" }}>${fac.total.toLocaleString("es-AR")}</span>
              <EtiquetaEstado estado={fac.estado} />
              <div>
                {fac.estado !== "anulado" && (
                  <button onClick={() => onAnularVenta(fac.id)} style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fca5a5", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Anular Venta</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gastos de Proveedores */}
      {pestañaActiva === "gastos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setMostrarModal(true)} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Registrar Factura de Compra
            </button>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.6fr 1.2fr 1fr 1fr", padding: "12px 24px", background: "#f9fafb", fontSize: 10, fontWeight: 800, color: "#9ca3af" }}>
              <span>COMPRA</span><span>PROVEEDOR</span><span>DETALLE / PRODUCTO</span><span>VENCIMIENTO</span><span>MONTO</span><span>ESTADO</span>
            </div>
            {gastos.map(gas => (
              <div key={gas.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.6fr 1.2fr 1fr 1fr", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #f3f4f6" }}>
                <div><span style={{ fontSize: 13, fontWeight: 700 }}>{gas.id}</span><div style={{ fontSize: 11, color: "#9ca3af" }}>{gas.fecha}</div></div>
                <span style={{ fontSize: 13, color: "#4b5563", fontWeight: 600 }}>{gas.proveedor}</span>
                <div>
                  <span style={{ fontSize: 12, color: "#1a1a2e" }}>{gas.concepto}</span>
                </div>
                <span style={{ fontSize: 12, color: gas.estado === "pendiente" ? "#d97706" : "#6b7280" }}>{gas.vencimiento}</span>
                <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 700 }}>${gas.total.toLocaleString("es-AR")}</span>
                <div>
                  {gas.estado === "pendiente" ? (
                    <button onClick={() => manejarPagarGasto(gas.id, gas.proveedor, gas.total)} style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Pagar</button>
                  ) : <EtiquetaEstado estado="pagado" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Gastos */}
      {mostrarModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: 460, padding: "24px", display: "flex", flexDirection: "column", gap: 14, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 17, fontWeight: 800 }}>Cargar Factura de Proveedor</h3>
              <button onClick={() => setMostrarModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icono d={iconos.cerrar} tamano={18} /></button>
            </div>

            <form onSubmit={manejarGuardarGasto} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>PROVEEDOR *</label>
                <input type="text" required value={proveedor} onChange={e => setProveedor(e.target.value)} placeholder="Arcor, Sancor..." style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 13, boxSizing: "border-box" }} />
              </div>

              <div style={{ background: "#f8fafc", padding: "10px", borderRadius: 8, border: "1px dashed #cbd5e1" }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "center" }}>
                  <input type="checkbox" id="nuevoCheck" checked={esProductoNuevo} onChange={e => { setEsProductoNuevo(e.target.checked); setProductoExistenteSeleccionado(""); }} />
                  <label htmlFor="nuevoCheck" style={{ fontSize: 12, fontWeight: 700, color: "#1e3a8a", cursor: "pointer" }}>¿Es un producto NUEVO que no está en stock?</label>
                </div>

                {esProductoNuevo ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                    <input type="text" value={nuevoNombreProducto} onChange={e => setNuevoNombreProducto(e.target.value)} placeholder="Nombre del nuevo producto..." style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid #bfdbfe", fontSize: 12, boxSizing: "border-box" }} />
                    <input type="text" value={nuevoEan} onChange={e => setNuevoEan(e.target.value)} placeholder="Código EAN..." style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid #bfdbfe", fontSize: 12, boxSizing: "border-box" }} />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>Asociar a Producto Existente</label>
                    <select value={productoExistenteSeleccionado} onChange={e => setProductoExistenteSeleccionado(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 12, background: "#fff", height: "34px" }}>
                      <option value="">-- No aplica / Gasto General --</option>
                      {productos && productos.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                    </select>
                  </div>
                )}

                {(esProductoNuevo || productoExistenteSeleccionado) && (
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>Cantidad de Unidades Compradas</label>
                    <input type="number" min="1" value={cantidadComprada} onChange={e => setCantidadComprada(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 12, boxSizing: "border-box" }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>CONCEPTO / DESCRIPCIÓN *</label>
                <input type="text" required value={concepto} onChange={e => setConcepto(e.target.value)} placeholder="Ej: Compra de mercadería..." style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 13, boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>FECHA EMISIÓN *</label>
                  <input type="date" required value={fechaFactura} onChange={e => setFechaFactura(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 12, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>VENCIMIENTO</label>
                  <input type="date" disabled={estadoPago === "pagado"} required={estadoPago === "pendiente"} value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 12, boxSizing: "border-box", background: estadoPago === "pagado" ? "#f3f4f6" : "#fff" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>MONTO DE LA COMPRA *</label>
                  <input type="number" required min="1" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0.00" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>ESTADO PAGO</label>
                  <select value={estadoPago} onChange={e => { setEstadoPago(e.target.value); if(e.target.value === "pagado") setFechaVencimiento(""); }} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 12, background: "#fff", height: "36px" }}>
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 6, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ padding: "8px 14px", borderRadius: 6, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12, cursor: "pointer" }}>Cancelar</button>
                <button type="submit" style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Guardar Compra</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}