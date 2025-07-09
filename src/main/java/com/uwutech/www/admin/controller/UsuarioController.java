package com.uwutech.www.admin.controller;

import com.uwutech.www.core.model.Usuario;
import com.uwutech.www.core.service.UsuarioService;
import com.uwutech.www.core.repository.UsuarioRepository;
import com.uwutech.www.core.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private RolRepository rolRepository;

    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsuarios() {
        try {
            List<Usuario> usuarios = usuarioService.getAllUsuarios();
            // Limpiar contraseñas antes de enviar
            usuarios.forEach(usuario -> usuario.setPasswordHash(null));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", usuarios);
            response.put("message", "Usuarios obtenidos exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener usuarios: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Integer id) {
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(id);
            if (usuario.isPresent()) {
                Usuario usr = usuario.get();
                usr.setPasswordHash(null); // No enviar contraseña
                return ResponseEntity.ok(usr);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Crear nuevo usuario
    @PostMapping
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        try {
            // Validaciones de unicidad
            if (usuario.getUsername() != null && usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un usuario con ese nombre de usuario"));
            }
            
            if (usuario.getEmail() != null && usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un usuario con ese email"));
            }
            
            if (usuario.getDni() != null && usuarioRepository.findByDni(usuario.getDni()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Ya existe un usuario con ese DNI"));
            }

            // Validaciones de campos requeridos
            if (usuario.getNombres() == null || usuario.getNombres().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El nombre es obligatorio"));
            }
            
            if (usuario.getApellidos() == null || usuario.getApellidos().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Los apellidos son obligatorios"));
            }
            
            if (usuario.getDni() == null || usuario.getDni().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El DNI es obligatorio"));
            }
            
            if (usuario.getUsername() == null || usuario.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El nombre de usuario es obligatorio"));
            }
            
            if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El email es obligatorio"));
            }
            
            if (usuario.getPasswordHash() == null || usuario.getPasswordHash().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "La contraseña es obligatoria"));
            }

            // Establecer valores por defecto
            if (usuario.getActivo() == null) {
                usuario.setActivo(true);
            }
            
            // En un entorno de producción, la contraseña debería ser encriptada aquí
            // usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
            
            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            usuarioGuardado.setPasswordHash(null); // No devolver contraseña
            
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error al crear el usuario: " + e.getMessage()));
        }
    }

    // Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioActualizado) {
        try {
            Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
            if (!usuarioExistente.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Usuario usuario = usuarioExistente.get();
            
            // Validar unicidad para otros usuarios
            if (usuarioActualizado.getUsername() != null) {
                Optional<Usuario> usuarioConMismoUsername = usuarioRepository.findByUsername(usuarioActualizado.getUsername());
                if (usuarioConMismoUsername.isPresent() && !usuarioConMismoUsername.get().getId_usuario().equals(id)) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otro usuario con ese nombre de usuario"));
                }
            }
            
            if (usuarioActualizado.getEmail() != null) {
                Optional<Usuario> usuarioConMismoEmail = usuarioRepository.findByEmail(usuarioActualizado.getEmail());
                if (usuarioConMismoEmail.isPresent() && !usuarioConMismoEmail.get().getId_usuario().equals(id)) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otro usuario con ese email"));
                }
            }
            
            if (usuarioActualizado.getDni() != null) {
                Optional<Usuario> usuarioConMismoDni = usuarioRepository.findByDni(usuarioActualizado.getDni());
                if (usuarioConMismoDni.isPresent() && !usuarioConMismoDni.get().getId_usuario().equals(id)) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Ya existe otro usuario con ese DNI"));
                }
            }

            // Actualizar campos
            if (usuarioActualizado.getNombres() != null) {
                usuario.setNombres(usuarioActualizado.getNombres());
            }
            if (usuarioActualizado.getApellidos() != null) {
                usuario.setApellidos(usuarioActualizado.getApellidos());
            }
            if (usuarioActualizado.getDni() != null) {
                usuario.setDni(usuarioActualizado.getDni());
            }
            if (usuarioActualizado.getFechaNacimiento() != null) {
                usuario.setFechaNacimiento(usuarioActualizado.getFechaNacimiento());
            }
            if (usuarioActualizado.getGenero() != null) {
                usuario.setGenero(usuarioActualizado.getGenero());
            }
            if (usuarioActualizado.getEstadoCivil() != null) {
                usuario.setEstadoCivil(usuarioActualizado.getEstadoCivil());
            }
            if (usuarioActualizado.getTelefono() != null) {
                usuario.setTelefono(usuarioActualizado.getTelefono());
            }
            if (usuarioActualizado.getEmail() != null) {
                usuario.setEmail(usuarioActualizado.getEmail());
            }
            if (usuarioActualizado.getUsername() != null) {
                usuario.setUsername(usuarioActualizado.getUsername());
            }
            if (usuarioActualizado.getFechaIngreso() != null) {
                usuario.setFechaIngreso(usuarioActualizado.getFechaIngreso());
            }
            if (usuarioActualizado.getRol() != null) {
                usuario.setRol(usuarioActualizado.getRol());
            }
            if (usuarioActualizado.getFotoPerfil() != null) {
                usuario.setFotoPerfil(usuarioActualizado.getFotoPerfil());
            }
            if (usuarioActualizado.getActivo() != null) {
                usuario.setActivo(usuarioActualizado.getActivo());
            }
            
            // Solo actualizar contraseña si se proporciona una nueva
            if (usuarioActualizado.getPasswordHash() != null && !usuarioActualizado.getPasswordHash().trim().isEmpty()) {
                // En producción, encriptar la nueva contraseña
                usuario.setPasswordHash(usuarioActualizado.getPasswordHash());
            }
            
            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            usuarioGuardado.setPasswordHash(null); // No devolver contraseña
            
            return ResponseEntity.ok(usuarioGuardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error al actualizar el usuario: " + e.getMessage()));
        }
    }

    // Cambiar estado del usuario (activar/desactivar)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> toggleEstadoUsuario(@PathVariable Integer id) {
        try {
            Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
            if (!usuarioExistente.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Usuario usuario = usuarioExistente.get();
            usuario.setActivo(!usuario.getActivo());
            
            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            usuarioGuardado.setPasswordHash(null); // No devolver contraseña
            
            return ResponseEntity.ok(usuarioGuardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error al cambiar el estado del usuario: " + e.getMessage()));
        }
    }

    // Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Integer id) {
        try {
            Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
            if (!usuarioExistente.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            usuarioRepository.deleteById(id);
            return ResponseEntity.ok().body(Map.of("message", "Usuario eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error al eliminar el usuario: " + e.getMessage()));
        }
    }

    // Login (método existente mejorado)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            String username = loginData.get("username");
            String password = loginData.get("password");
            
            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username y password son requeridos"));
            }
            
            Usuario usuario = usuarioRepository.findByUsernameAndPasswordHash(username, password);
            if (usuario != null && usuario.getActivo()) {
                // No enviar la contraseña al frontend
                Map<String, Object> userData = new HashMap<>();
                userData.put("id_usuario", usuario.getId_usuario());
                userData.put("nombres", usuario.getNombres());
                userData.put("apellidos", usuario.getApellidos());
                userData.put("username", usuario.getUsername());
                userData.put("email", usuario.getEmail());
                userData.put("activo", usuario.getActivo());
                userData.put("rol", usuario.getRol());
                
                return ResponseEntity.ok(userData);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales inválidas o usuario inactivo"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error en el servidor: " + e.getMessage()));
        }
    }
}