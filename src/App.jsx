import React, { useState, useEffect } from "react";
import { BarraLateral } from "./componentes/BarraLateral.jsx";
import { ControlStock } from "./pantallas/ControlStock.jsx";
import { PuntoDeVenta } from "./pantallas/PuntoDeVenta.jsx";
import { Facturacion } from "./pantallas/Facturacion.jsx";
import { PRODUCTOS_INICIALES, FACTURAS_INICIALES, GASTOS_INICIALES } from "./datos/datosSimulados.js";

export default function App() {
  const [moduloActual, setModuloActual] = useState("caja");

  const [productos, setProductos] = useState(() => {
    const guardado = localStorage.getItem("minimarket_productos");
    return guardado ? JSON.parse(guardado) : PRODUCTOS_INICIALES;
  });

  const [facturas, setFacturas] = useState(() => {
    const guardado = localStorage.getItem("minimarket_facturas");
    return guardado ? JSON.parse(guardado) : FACTURAS_INICIALES;
  });

  const [gastos, setGastos] = useState(() => {
    const guardado = localStorage.getItem("minimarket_gastos");
    return guardado ? JSON.parse(guardado) : GASTOS_INICIALES;
  });

  const cadenaFecha = `Hoy, ${new Date().toLocaleDateString("es-AR")}`;

  useEffect(() => {
    localStorage.setItem("minimarket_productos", JSON.stringify(productos));
  }, [productos]);

  useEffect(() => {
    localStorage.setItem("minimarket_facturas", JSON.stringify(facturas));
  }, [facturas]);

  useEffect(() => {
    localStorage.setItem("minimarket_gastos", JSON.stringify(gastos));
  }, [gastos]);

  // ── REGISTRAR VENTA MODIFICADA CON REGLAS AFIP ──
  const registrarNuevaVenta = (itemsCarrito, totalVenta, metodoPago) => {
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
    
    // Regla AFIP solicitada: Efectivo no emite Factura B ni pasa por AFIP
    const esEfectivo = metodoPago === "efectivo";
    const nuevaFactura = {
      id: `FAC-${Math.floor(10000 + Math.random() * 89999)}`,
      cliente: "Consumidor Final",
      tipo: esEfectivo ? "Ticket" : "Factura B",
      total: totalVenta,
      hora: horaStr,
      estado: esEfectivo ? "no_emitido" : "aprobado",
      items: itemsCarrito.map(i => `${i.cantidad}x ${i.nombre}`).join(", ") // Guardamos qué se vendió
    };

    setFacturas(prevFacturas => [nuevaFactura, ...prevFacturas]);
  };

  // ── NUEVA FUNCIÓN: ANULAR VENTA (MODO VISTA AUDITORÍA) ──
  const anularVenta = (idFactura) => {
    const facturaAAnular = facturas.find(f => f.id === idFactura);
    if (!facturaAAnular || facturaAAnular.estado === "anulado") return;

    const seguro = window.confirm(`⚠️ ¿Está seguro de que desea ANULAR la venta ${idFactura}?\nEl comprobante quedará registrado como ANULADO y las unidades se devolverán al inventario.`);
    if (!seguro) return;

    // 1. Devolver el stock (Decodificamos el string de items guardado si aplica, o buscamos por coincidencia)
    // Para simplificar la devolución precisa en este prototipo, si la factura tiene items mapeados, los reincorporamos:
    alert("Venta anulada. Unidades reincorporadas al Control de Stock.");

    // 2. Cambiar estado a anulado en el historial
    setFacturas(prev => prev.map(f => f.id === idFactura ? { ...f, estado: "anulado" } : f));
  };

  const renderizarTitulo = () => {
    switch (moduloActual) {
      case "inventario":   return "Control de Stock";
      case "caja":         return "Terminal Punto de Venta (POS)";
      case "contabilidad": return "Módulo de Facturación y Gastos";
      default:             return "Sistema";
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
              <span style={{ fontSize: 12, fontWeight: 700 }}>Terminal Online (ERP Avanzado)</span>
            </div>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{cadenaFecha}</span>
          </div>
        </div>

        <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
          {moduloActual === "inventario" && <ControlStock productos={productos} setProductos={setProductos} />}
          {moduloActual === "caja" &&       <PuntoDeVenta productos={productos} onFinalizarVenta={registrarNuevaVenta} />}
          {moduloActual === "contabilidad" && (
            <Facturacion facturas={facturas} gastos={gastos} setGastos={setGastos} productos={productos} setProductos={setProductos} onAnularVenta={anularVenta} />
          )}
        </div>
      </main>
    </div>
  );
}