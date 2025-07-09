package com.uwutech.www.core.model;

// Producto.java (versión actualizada con relaciones)

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_producto;

    @Column(unique = true)
    private String codigo_sku;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "precio_venta", nullable = false)
    private Double precioVenta;

    @Column(name = "costo_compra")
    private Double costoCompra;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "stock_minimo")
    private Integer stockMinimo;

    @Column(name = "imagen_url")
    private String imagenUrl;

    private Boolean activo = true;

    // --- Relaciones ---
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_marca")
    private Marca marca;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;
}