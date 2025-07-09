package com.uwutech.www.admin.controller;


import com.uwutech.www.core.model.Cliente;
import com.uwutech.www.core.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public List<Cliente> getAllClientes() {
        return clienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Integer id) {
        return clienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Cliente createCliente(@RequestBody Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> updateCliente(@PathVariable Integer id, @RequestBody Cliente clienteDetails) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    // Actualiza todos los campos
                    cliente.setNombres(clienteDetails.getNombres());
                    cliente.setApellidos(clienteDetails.getApellidos());
                    cliente.setNumero_documento(clienteDetails.getNumero_documento());
                    // ... etc para todos los campos
                    return ResponseEntity.ok(clienteRepository.save(cliente));
                }).orElse(ResponseEntity.notFound().build());
    }
}