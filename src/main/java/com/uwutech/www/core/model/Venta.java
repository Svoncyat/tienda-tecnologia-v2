package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "ventas")
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_venta;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_caja", nullable = false)
    private Caja caja;

    private String tipo_comprobante;
    private String serie;
    private String correlativo;
    private String tipo_pago;
    private Double subtotal;
    private Double descuento_general;
    private Double igv;
    private Double total;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime fecha_venta = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private EstadoVenta estado;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleVenta> detalles;

    public enum EstadoVenta {
        COMPLETADA, ANULADA
    }
}

