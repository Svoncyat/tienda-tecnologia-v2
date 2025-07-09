package com.uwutech.www.admin.controller;


import com.uwutech.www.core.model.Producto;
import com.uwutech.www.core.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Integer id) {
        return productoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<Producto> createProductoConImagen(
            @RequestPart("producto") Producto producto,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        if (imagen != null && !imagen.isEmpty()) {
            String nombreArchivo = System.currentTimeMillis() + "_" + StringUtils.cleanPath(imagen.getOriginalFilename());
            String uploadDir = "src/main/resources/static/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();
            Path rutaArchivo = Paths.get(uploadDir + nombreArchivo);
            Files.copy(imagen.getInputStream(), rutaArchivo);
            producto.setImagenUrl("/uploads/" + nombreArchivo);
        }
        Producto guardado = productoRepository.save(producto);
        return ResponseEntity.ok(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Integer id, @RequestBody Producto productoDetails) {
        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setNombre(productoDetails.getNombre());
                    producto.setCodigo_sku(productoDetails.getCodigo_sku());
                    producto.setDescripcion(productoDetails.getDescripcion());
                    producto.setPrecioVenta(productoDetails.getPrecioVenta());
                    producto.setCostoCompra(productoDetails.getCostoCompra());
                    producto.setStockMinimo(productoDetails.getStockMinimo());
                    producto.setActivo(productoDetails.getActivo());
                    producto.setMarca(productoDetails.getMarca());
                    producto.setCategoria(productoDetails.getCategoria());

                    return ResponseEntity.ok(productoRepository.save(producto));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        return productoRepository.findById(id)
                .map(producto -> {
                    productoRepository.delete(producto);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}