package com.uwutech.www.admin.controller;

import com.uwutech.www.core.model.Cliente;
import com.uwutech.www.core.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllClientes() {
        try {
            List<Cliente> clientes = clienteService.getAllClientes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", clientes);
            response.put("message", "Clientes obtenidos exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener clientes: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getClienteById(@PathVariable Integer id) {
        try {
            return clienteService.getClienteById(id)
                    .map(cliente -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("data", cliente);
                        response.put("message", "Cliente encontrado");
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener cliente: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createCliente(@RequestBody Cliente cliente) {
        try {
            // Validaciones básicas
            if (cliente.getNumero_documento() == null || cliente.getNumero_documento().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El número de documento es obligatorio");
                return ResponseEntity.badRequest().body(response);
            }

            if (clienteService.existeDocumento(cliente.getNumero_documento())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Ya existe un cliente con este número de documento");
                return ResponseEntity.badRequest().body(response);
            }

            Cliente clienteGuardado = clienteService.saveCliente(cliente);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", clienteGuardado);
            response.put("message", "Cliente creado exitosamente");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al crear cliente: " + e.getMessage());
            e.printStackTrace(); // Para debugging
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCliente(@PathVariable Integer id, @RequestBody Cliente clienteDetails) {
        try {
            Cliente clienteActualizado = clienteService.updateCliente(id, clienteDetails);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", clienteActualizado);
            response.put("message", "Cliente actualizado exitosamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al actualizar cliente: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteCliente(@PathVariable Integer id) {
        try {
            clienteService.deleteCliente(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cliente desactivado exitosamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al eliminar cliente: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}