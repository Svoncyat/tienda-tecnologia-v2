package com.uwutech.www.admin.controller;

import com.uwutech.www.core.model.Usuario;
import com.uwutech.www.core.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public Usuario createUsuario(@RequestBody Usuario usuario) {
        // En un caso real, la contraseña debería ser encriptada aquí
        return usuarioRepository.save(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        Usuario usuario = usuarioRepository.findByUsernameAndPasswordHash(username, password);
        if (usuario != null) {
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
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }
}