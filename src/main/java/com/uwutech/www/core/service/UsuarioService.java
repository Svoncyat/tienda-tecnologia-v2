package com.uwutech.www.core.service;

import com.uwutech.www.core.model.Usuario;
import com.uwutech.www.core.repository.UsuarioRepository;
import com.uwutech.www.core.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private RolRepository rolRepository;

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }
    
    public List<Usuario> getUsuariosActivos() {
        return usuarioRepository.findByActivoTrue();
    }

    public Optional<Usuario> getUsuarioById(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Usuario saveUsuario(Usuario usuario) {
        // Validaciones básicas
        if (usuario.getDni() != null && existeDni(usuario.getDni()) && usuario.getId_usuario() == null) {
            throw new IllegalArgumentException("Ya existe un usuario con este DNI");
        }
        
        if (usuario.getEmail() != null && existeEmail(usuario.getEmail()) && usuario.getId_usuario() == null) {
            throw new IllegalArgumentException("Ya existe un usuario con este email");
        }
        
        if (usuario.getUsername() != null && existeUsername(usuario.getUsername()) && usuario.getId_usuario() == null) {
            throw new IllegalArgumentException("Ya existe un usuario con este nombre de usuario");
        }
        
        // Asegurar que el usuario esté activo por defecto
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }
        
        // Establecer fecha de ingreso si no está presente
        if (usuario.getFechaIngreso() == null) {
            usuario.setFechaIngreso(LocalDate.now());
        }
        
        return usuarioRepository.save(usuario);
    }

    public Usuario updateUsuario(Integer id, Usuario usuarioDetails) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    // Validar campos únicos solo si han cambiado
                    if (usuarioDetails.getDni() != null && !usuarioDetails.getDni().equals(usuario.getDni()) && existeDni(usuarioDetails.getDni())) {
                        throw new IllegalArgumentException("Ya existe un usuario con este DNI");
                    }
                    
                    if (usuarioDetails.getEmail() != null && !usuarioDetails.getEmail().equals(usuario.getEmail()) && existeEmail(usuarioDetails.getEmail())) {
                        throw new IllegalArgumentException("Ya existe un usuario con este email");
                    }
                    
                    if (usuarioDetails.getUsername() != null && !usuarioDetails.getUsername().equals(usuario.getUsername()) && existeUsername(usuarioDetails.getUsername())) {
                        throw new IllegalArgumentException("Ya existe un usuario con este nombre de usuario");
                    }
                    
                    // Actualizar campos
                    if (usuarioDetails.getNombres() != null) usuario.setNombres(usuarioDetails.getNombres());
                    if (usuarioDetails.getApellidos() != null) usuario.setApellidos(usuarioDetails.getApellidos());
                    if (usuarioDetails.getDni() != null) usuario.setDni(usuarioDetails.getDni());
                    if (usuarioDetails.getFechaNacimiento() != null) usuario.setFechaNacimiento(usuarioDetails.getFechaNacimiento());
                    if (usuarioDetails.getGenero() != null) usuario.setGenero(usuarioDetails.getGenero());
                    if (usuarioDetails.getEstadoCivil() != null) usuario.setEstadoCivil(usuarioDetails.getEstadoCivil());
                    if (usuarioDetails.getTelefono() != null) usuario.setTelefono(usuarioDetails.getTelefono());
                    if (usuarioDetails.getEmail() != null) usuario.setEmail(usuarioDetails.getEmail());
                    if (usuarioDetails.getUsername() != null) usuario.setUsername(usuarioDetails.getUsername());
                    if (usuarioDetails.getPasswordHash() != null) usuario.setPasswordHash(usuarioDetails.getPasswordHash());
                    if (usuarioDetails.getFechaIngreso() != null) usuario.setFechaIngreso(usuarioDetails.getFechaIngreso());
                    if (usuarioDetails.getRol() != null) usuario.setRol(usuarioDetails.getRol());
                    if (usuarioDetails.getFotoPerfil() != null) usuario.setFotoPerfil(usuarioDetails.getFotoPerfil());
                    if (usuarioDetails.getActivo() != null) usuario.setActivo(usuarioDetails.getActivo());
                    
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    public void deleteUsuario(Integer id) {
        usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setActivo(false);
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }
    
    public void activarUsuario(Integer id) {
        usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setActivo(true);
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    public boolean existeDni(String dni) {
        return usuarioRepository.findByDni(dni).isPresent();
    }
    
    public boolean existeEmail(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }
    
    public boolean existeUsername(String username) {
        return usuarioRepository.findByUsername(username).isPresent();
    }
    
    public List<Usuario> buscarUsuarios(String busqueda) {
        return usuarioRepository.findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCaseOrUsernameContainingIgnoreCase(
                busqueda, busqueda, busqueda);
    }
    
    public List<Usuario> getUsuariosPorRol(Integer idRol) {
        return usuarioRepository.findByRol_Id_rol(idRol);
    }
}
