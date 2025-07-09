package com.uwutech.www.admin.controller;

import com.uwutech.www.core.model.Rol;
import com.uwutech.www.core.model.Permiso;
import com.uwutech.www.core.repository.RolRepository;
import com.uwutech.www.core.repository.PermisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;


@RestController
@RequestMapping("/api/roles")
public class RolController {

    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private PermisoRepository permisoRepository;

    // Listar todos los roles con sus permisos
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllRoles() {
        try {
            List<Rol> roles = rolRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", roles);
            response.put("message", "Roles obtenidos exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener roles: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Crear un nuevo rol con permisos (recibe ids de permisos)
    @PostMapping
    public ResponseEntity<Rol> createRol(@RequestBody Map<String, Object> payload) {
        Rol rol = new Rol();
        rol.setNombre((String) payload.get("nombre"));
        rol.setDescripcion((String) payload.get("descripcion"));
        rol.setActivo(true);
        // Obtener ids de permisos
        List<Integer> permisoIds = (List<Integer>) payload.get("permisos");
        if (permisoIds != null) {
            Set<Permiso> permisos = new HashSet<>(permisoRepository.findAllById(permisoIds));
            rol.setPermisos(permisos);
        }
        Rol nuevoRol = rolRepository.save(rol);
        return new ResponseEntity<>(nuevoRol, HttpStatus.CREATED);
    }

    // Editar un rol existente (recibe ids de permisos)
    @PutMapping("/{id}")
    public ResponseEntity<Rol> updateRol(@PathVariable Integer id, @RequestBody Map<String, Object> payload) {
        Optional<Rol> optionalRol = rolRepository.findById(id);
        if (!optionalRol.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Rol rol = optionalRol.get();
        rol.setNombre((String) payload.get("nombre"));
        rol.setDescripcion((String) payload.get("descripcion"));
        if (payload.containsKey("activo")) {
            rol.setActivo((Boolean) payload.get("activo"));
        }
        // Obtener ids de permisos
        List<Integer> permisoIds = (List<Integer>) payload.get("permisos");
        if (permisoIds != null) {
            Set<Permiso> permisos = new HashSet<>(permisoRepository.findAllById(permisoIds));
            rol.setPermisos(permisos);
        }
        Rol updatedRol = rolRepository.save(rol);
        return ResponseEntity.ok(updatedRol);
    }

    // Eliminar un rol
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRol(@PathVariable Integer id) {
        if (!rolRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rolRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Asignar permisos a un rol (opcional, ya cubierto en create/edit)
    @PostMapping("/{id}/permisos")
    public ResponseEntity<Rol> assignPermisosToRol(@PathVariable Integer id, @RequestBody List<Integer> permisoIds) {
        Optional<Rol> optionalRol = rolRepository.findById(id);
        if (!optionalRol.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Rol rol = optionalRol.get();
        Set<Permiso> permisos = new HashSet<>(permisoRepository.findAllById(permisoIds));
        rol.setPermisos(permisos);
        Rol updatedRol = rolRepository.save(rol);
        return ResponseEntity.ok(updatedRol);
    }
} 