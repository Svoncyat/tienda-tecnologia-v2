package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "compras")
public class Compra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_compra;

    @ManyToOne
    @JoinColumn(name = "id_proveedor", nullable = false)
    private Proveedor proveedor;

    @ManyToOne
    @JoinColumn(name = "id_usuario_receptor", nullable = false)
    private Usuario usuarioReceptor;

    private String tipo_comprobante;
    private String nro_comprobante;
    private Double total;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime fecha_recepcion = LocalDateTime.now();

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL)
    private List<DetalleCompra> detalles;
}
