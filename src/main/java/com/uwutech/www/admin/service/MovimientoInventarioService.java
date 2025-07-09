package com.uwutech.www.admin.service;

import com.uwutech.www.core.model.MovimientoInventario;
import com.uwutech.www.core.model.Producto;
import com.uwutech.www.core.model.Usuario;
import com.uwutech.www.core.repository.MovimientoInventarioRepository;
import com.uwutech.www.core.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MovimientoInventarioService {

    @Autowired
    private MovimientoInventarioRepository movimientoRepository;
    @Autowired
    private ProductoRepository productoRepository;

    @Transactional
    public void registrarMovimiento(Producto producto, int cantidad, MovimientoInventario.TipoMovimiento tipo, Integer referenciaId, Usuario usuario) {
        // 1. Actualizar el stock del producto
        int stockActual = producto.getStock();
        int nuevoStock = stockActual + cantidad;
        if (nuevoStock < 0) {
            throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
        }
        producto.setStock(nuevoStock);
        productoRepository.save(producto);

        // 2. Crear y guardar el registro del movimiento para auditoría
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setProducto(producto);
        movimiento.setCantidad(cantidad);
        movimiento.setTipo_movimiento(tipo);
        movimiento.setReferenciaId(referenciaId);
        movimiento.setUsuarioResponsable(usuario);

        movimientoRepository.save(movimiento);
    }
}