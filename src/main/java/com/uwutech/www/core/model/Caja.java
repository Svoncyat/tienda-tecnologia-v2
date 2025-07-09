package com.uwutech.www.core.model;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "cajas")
public class Caja {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_caja;

    private String nombre;
    private Double monto_apertura;
    private LocalDateTime fecha_apertura;
    private LocalDateTime fecha_cierre;
    private Double monto_cierre_real;

    @Enumerated(EnumType.STRING)
    private EstadoCaja estado;

    @ManyToOne
    @JoinColumn(name = "id_usuario_apertura", nullable = false)
    private Usuario usuarioApertura;

    @ManyToOne
    @JoinColumn(name = "id_usuario_cierre")
    private Usuario usuarioCierre;

    public enum EstadoCaja {
        ABIERTA, CERRADA
    }
}