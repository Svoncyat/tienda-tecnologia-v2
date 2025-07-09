package com.uwutech.www.core.model;



import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_cliente;

    @Enumerated(EnumType.STRING)
    private TipoCliente tipo_cliente;

    @Enumerated(EnumType.STRING)
    private TipoDocumento tipo_documento;

    @Column(unique = true, nullable = false)
    private String numero_documento;

    private String nombres;
    private String apellidos;
    private String razon_social;
    private String correo;
    private String telefono;
    private LocalDate fecha_nacimiento;
    private Boolean activo = true;

    public enum TipoCliente {
        PERSONA_NATURAL, EMPRESA
    }
    public enum TipoDocumento {
        DNI, RUC, OTRO
    }
}