package com.uwutech.www.admin.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ClienteDTO {
    private Integer id_cliente;
    private String tipo_cliente;
    private String tipo_documento;
    private String numero_documento;
    private String nombres;
    private String apellidos;
    private String razon_social;
    private String correo;
    private String telefono;
    private LocalDate fecha_nacimiento;
    private Boolean activo;
    
    // Campos calculados para el frontend
    private String nombre_completo;
    private String usuario;
    private String estado;
    private String ultimo_acceso;
    private String fecha_registro;
    
    public String getNombre_completo() {
        if (nombres != null && apellidos != null) {
            return nombres + " " + apellidos;
        } else if (razon_social != null) {
            return razon_social;
        }
        return "Sin nombre";
    }
    
    public String getUsuario() {
        if (correo != null) {
            return correo.split("@")[0];
        }
        return "sin_usuario";
    }
    
    public String getEstado() {
        return activo ? "activo" : "inactivo";
    }
}
