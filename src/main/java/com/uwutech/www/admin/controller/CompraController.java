package com.uwutech.www.admin.controller;

import com.uwutech.www.admin.dto.CompraDTO;
import com.uwutech.www.core.model.Compra;
import com.uwutech.www.admin.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired
    private CompraService compraService;

    @PostMapping
    public ResponseEntity<Compra> createCompra(@RequestBody CompraDTO compraDTO) {
        return ResponseEntity.ok(compraService.registrarCompra(compraDTO));
    }
}