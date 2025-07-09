package com.uwutech.www.admin.service;

import com.uwutech.www.admin.dto.CompraDTO;
import com.uwutech.www.core.model.*;
import com.uwutech.www.core.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class CompraService {

    @Autowired private CompraRepository compraRepository;
    @Autowired private ProveedorRepository proveedorRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ProductoRepository productoRepository;
    // --- INYECTAMOS EL NUEVO SERVICIO ---
    @Autowired private MovimientoInventarioService movimientoInventarioService;

    @Transactional
    public Compra registrarCompra(CompraDTO compraDTO) {
        Proveedor proveedor = proveedorRepository.findById(compraDTO.getIdProveedor()).orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        Usuario usuario = usuarioRepository.findById(compraDTO.getIdUsuarioReceptor()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Compra compra = new Compra();
        compra.setProveedor(proveedor);
        compra.setUsuarioReceptor(usuario);
        compra.setTipo_comprobante(compraDTO.getTipoComprobante());
        compra.setNro_comprobante(compraDTO.getNroComprobante());

        List<DetalleCompra> detalles = new ArrayList<>();
        double totalCompra = 0;

        for (var detalleDTO : compraDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getIdProducto()).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            DetalleCompra detalle = new DetalleCompra();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecio_unit(detalleDTO.getPrecioUnitario());
            detalle.setSubtotal(detalleDTO.getCantidad() * detalleDTO.getPrecioUnitario());
            detalle.setCompra(compra);
            detalles.add(detalle);
            totalCompra += detalle.getSubtotal();
        }

        compra.setDetalles(detalles);
        compra.setTotal(totalCompra);

        // 1. Guardar la compra para obtener su ID
        Compra compraGuardada = compraRepository.save(compra);

        // 2. Registrar los movimientos de inventario
        for (DetalleCompra detalle : compraGuardada.getDetalles()) {
            movimientoInventarioService.registrarMovimiento(
                    detalle.getProducto(),
                    detalle.getCantidad(), // Cantidad positiva porque es una entrada
                    MovimientoInventario.TipoMovimiento.COMPRA,
                    compraGuardada.getId_compra(),
                    usuario
            );
        }

        return compraGuardada;
    }
}