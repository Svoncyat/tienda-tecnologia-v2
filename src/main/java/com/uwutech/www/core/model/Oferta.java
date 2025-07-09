package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "ofertas")
public class Oferta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_oferta;

    private String nombre;
    private String descripcion;

    @Column(name = "tipo_oferta") // Ej: "PORCENTAJE", "MONTO_FIJO"
    private String tipoOferta;

    private Double valor; // El valor del descuento (ej: 15.0 para 15% o 10.0 para S/10)

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    private Boolean activo = true;
}