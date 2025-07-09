package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "movimientos_inventario")
public class MovimientoInventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_movimiento;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimiento tipo_movimiento;

    @Column(nullable = false)
    private int cantidad; // Positivo para entradas, negativo para salidas

    @Column(name = "referencia_id")
    private Integer referenciaId; // Puede ser id_venta, id_compra, id_pedido

    @ManyToOne
    @JoinColumn(name = "id_usuario_responsable")
    private Usuario usuarioResponsable;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime fecha_movimiento = LocalDateTime.now();

    public enum TipoMovimiento {
        VENTA, COMPRA, ENTREGA_PEDIDO, ANULACION_VENTA, AJUSTE_MANUAL
    }
}