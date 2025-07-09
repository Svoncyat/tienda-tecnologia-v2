package com.uwutech.www.core.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

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
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha_nacimiento;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "fecha_registro")
    private LocalDateTime fecha_registro = LocalDateTime.now();
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimo_acceso;
    
    private Boolean activo = true;

    public enum TipoCliente {
        PERSONA_NATURAL("Persona Natural"), 
        EMPRESA("Empresa");
        
        private String displayName;
        
        TipoCliente(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum TipoDocumento {
        DNI("DNI"), 
        RUC("RUC"), 
        CE("Carnet de Extranjería"),
        PASAPORTE("Pasaporte");
        
        private String displayName;
        
        TipoDocumento(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}