package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usuario;
    private String nombres;
    private String apellidos;
    @Column(unique = true)
    private String dni;
    @Column(unique = true)
    private String username;
    @Column(unique = true)
    private String email;
    private String passwordHash; // En una app real, esto se manejaría con Spring Security
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol rol;
}