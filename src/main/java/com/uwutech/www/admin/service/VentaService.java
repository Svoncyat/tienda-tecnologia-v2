package com.uwutech.www.admin.service;

import com.uwutech.www.admin.dto.VentaDTO;
import com.uwutech.www.core.model.*;
import com.uwutech.www.core.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class VentaService {

    @Autowired private VentaRepository ventaRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private CajaRepository cajaRepository;
    // --- INYECTAMOS EL NUEVO SERVICIO ---
    @Autowired private MovimientoInventarioService movimientoInventarioService;

    @Transactional
    public Venta registrarVenta(VentaDTO ventaDTO) {
        // 1. Validar y obtener entidades principales
        Cliente cliente = ventaDTO.getIdCliente() != null ? clienteRepository.findById(ventaDTO.getIdCliente()).orElse(null) : null;
        Usuario usuario = usuarioRepository.findById(ventaDTO.getIdUsuario()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Caja caja = cajaRepository.findById(ventaDTO.getIdCaja()).orElseThrow(() -> new RuntimeException("Caja no encontrada"));

        Venta venta = new Venta();
        venta.setCliente(cliente);
        venta.setUsuario(usuario);
        venta.setCaja(caja);
        venta.setTipo_comprobante(ventaDTO.getTipoComprobante());
        venta.setTipo_pago(ventaDTO.getTipoPago());
        venta.setEstado(Venta.EstadoVenta.COMPLETADA);

        List<DetalleVenta> detalles = new ArrayList<>();
        double subtotalVenta = 0;

        for (var detalleDTO : ventaDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detalleDTO.getIdProducto()));

            DetalleVenta detalleVenta = new DetalleVenta();
            detalleVenta.setProducto(producto);
            detalleVenta.setCantidad(detalleDTO.getCantidad());
            detalleVenta.setPrecio_unit(detalleDTO.getPrecioUnitario());
            double subtotalDetalle = detalleDTO.getCantidad() * detalleDTO.getPrecioUnitario();
            detalleVenta.setSubtotal(subtotalDetalle);
            detalleVenta.setVenta(venta);
            detalles.add(detalleVenta);
            subtotalVenta += subtotalDetalle;
        }

        // Se asignan los detalles antes de guardar para que se generen las claves
        venta.setDetalles(detalles);

        // 2. Guardar la venta para obtener su ID
        Venta ventaGuardada = ventaRepository.save(venta);

        // 3. Registrar los movimientos de inventario ahora que tenemos el ID de la venta
        for (DetalleVenta detalle : ventaGuardada.getDetalles()) {
            movimientoInventarioService.registrarMovimiento(
                    detalle.getProducto(),
                    -detalle.getCantidad(), // Cantidad negativa porque es una salida
                    MovimientoInventario.TipoMovimiento.VENTA,
                    ventaGuardada.getId_venta(), // Usamos el ID de la venta ya guardada
                    usuario
            );
        }

        // 4. Calcular IGV y Total y actualizar la venta
        double igv = subtotalVenta * 0.18; // Asumiendo 18% de IGV
        double total = subtotalVenta + igv;
        ventaGuardada.setSubtotal(subtotalVenta);
        ventaGuardada.setIgv(igv);
        ventaGuardada.setTotal(total);

        return ventaRepository.save(ventaGuardada);
    }

    @Transactional
    public Venta anularVenta(Integer ventaId) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));

        if(venta.getEstado() == Venta.EstadoVenta.ANULADA) {
            throw new RuntimeException("La venta ya se encuentra anulada.");
        }

        venta.setEstado(Venta.EstadoVenta.ANULADA);

        for (DetalleVenta detalle : venta.getDetalles()) {
            movimientoInventarioService.registrarMovimiento(
                    detalle.getProducto(),
                    detalle.getCantidad(), // Cantidad positiva porque el stock se devuelve
                    MovimientoInventario.TipoMovimiento.ANULACION_VENTA,
                    venta.getId_venta(),
                    venta.getUsuario() // El usuario original de la venta
            );
        }

        return ventaRepository.save(venta);
    }
}