package com.uwutech.www.core.service;

import com.uwutech.www.core.model.Cliente;
import com.uwutech.www.core.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> getAllClientes() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> getClienteById(Integer id) {
        return clienteRepository.findById(id);
    }

    public Cliente saveCliente(Cliente cliente) {
        // Validación básica
        if (cliente.getNumero_documento() == null || cliente.getNumero_documento().trim().isEmpty()) {
            throw new IllegalArgumentException("El número de documento es obligatorio");
        }
        
        // Verificar si ya existe un cliente con el mismo número de documento
        if (existeDocumento(cliente.getNumero_documento())) {
            throw new IllegalArgumentException("Ya existe un cliente con este número de documento");
        }
        
        // Establecer fecha de registro si no existe
        if (cliente.getFecha_registro() == null) {
            cliente.setFecha_registro(LocalDateTime.now());
        }
        
        // Asegurar que el cliente esté activo por defecto
        if (cliente.getActivo() == null) {
            cliente.setActivo(true);
        }
        
        return clienteRepository.save(cliente);
    }

    public Cliente updateCliente(Integer id, Cliente clienteDetails) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setTipo_cliente(clienteDetails.getTipo_cliente());
                    cliente.setTipo_documento(clienteDetails.getTipo_documento());
                    cliente.setNumero_documento(clienteDetails.getNumero_documento());
                    cliente.setNombres(clienteDetails.getNombres());
                    cliente.setApellidos(clienteDetails.getApellidos());
                    cliente.setRazon_social(clienteDetails.getRazon_social());
                    cliente.setCorreo(clienteDetails.getCorreo());
                    cliente.setTelefono(clienteDetails.getTelefono());
                    cliente.setFecha_nacimiento(clienteDetails.getFecha_nacimiento());
                    return clienteRepository.save(cliente);
                })
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
    }

    public void deleteCliente(Integer id) {
        clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setActivo(false);
                    return clienteRepository.save(cliente);
                })
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
    }

    public boolean existeDocumento(String numeroDocumento) {
        return clienteRepository.findByNumeroDocumento(numeroDocumento).isPresent();
    }
}
