package com.uwutech.www.admin.controller;


import com.uwutech.www.admin.dto.VentaDTO;
import com.uwutech.www.core.model.Venta;
import com.uwutech.www.admin.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @PostMapping
    public ResponseEntity<Venta> createVenta(@RequestBody VentaDTO ventaDTO) {
        try {
            Venta nuevaVenta = ventaService.registrarVenta(ventaDTO);
            return ResponseEntity.ok(nuevaVenta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Considerar un DTO de error más específico
        }
    }
}
