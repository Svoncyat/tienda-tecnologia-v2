package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "proveedores")
public class Proveedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_proveedor;

    @Column(unique = true, nullable = false)
    private String ruc;

    @Column(nullable = false)
    private String razon_social;

    private String nombre_comercial;
    private String correo;
    private String telefono;
    private String direccion;
    private Boolean activo = true;
}