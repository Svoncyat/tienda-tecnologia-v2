package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_pedido;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    private Double total;
    private String direccion_entrega;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime fecha_pedido = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<DetallePedido> detalles;

    public enum EstadoPedido {
        PENDIENTE, CONFIRMADO, EN_CAMINO, ENTREGADO, CANCELADO
    }
}

