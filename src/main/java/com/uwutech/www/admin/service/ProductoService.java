package com.uwutech.www.admin.service;


import com.uwutech.www.core.model.Producto;
import com.uwutech.www.core.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional
    public void actualizarStock(Integer idProducto, int cantidad) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        int nuevoStock = producto.getStock() + cantidad;
        if (nuevoStock < 0) {
            throw new RuntimeException("Stock insuficiente");
        }
        producto.setStock(nuevoStock);
        productoRepository.save(producto);
    }
}