package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "permisos")
public class Permiso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_permiso;

    private String nombre;

    private String descripcion;
}