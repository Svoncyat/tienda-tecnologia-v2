package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usuario;
    
    @Column(name = "nombres")
    private String nombres;
    
    @Column(name = "apellidos")
    private String apellidos;
    
    @Column(name = "dni", unique = true)
    private String dni;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "genero")
    private Genero genero;
    
    @Column(name = "estado_civil", length = 20)
    private String estadoCivil;
    
    @Column(name = "telefono", length = 15)
    private String telefono;
    
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "username", unique = true)
    private String username;
    
    @Column(name = "password_hash")
    private String passwordHash;
    
    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;
    
    @Column(name = "foto_perfil", columnDefinition = "TEXT")
    private String fotoPerfil;
    
    @Column(name = "activo")
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol")
    private Rol rol;
    
    // Enum para género según la base de datos
    public enum Genero {
        Masculino, Femenino, Otro
    }
    
    // Métodos de conveniencia
    public String getNombreCompleto() {
        return (nombres != null ? nombres : "") + " " + (apellidos != null ? apellidos : "");
    }
    
    public String getEstado() {
        return activo != null && activo ? "Activo" : "Inactivo";
    }
    
    // Para compatibilidad con el frontend que espera un string del rol
    public String getRolNombre() {
        return rol != null ? rol.getNombre() : null;
    }
}