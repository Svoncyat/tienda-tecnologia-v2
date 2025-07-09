package com.uwutech.www.admin.dto;

import lombok.Data;

@Data
public class DetalleVentaDTO {
    private Integer idProducto;
    private int cantidad;
    private double precioUnitario;
}
