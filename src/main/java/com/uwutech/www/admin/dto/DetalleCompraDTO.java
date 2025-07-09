package com.uwutech.www.admin.dto;

import lombok.Data;

@Data
public class DetalleCompraDTO {
    private Integer idProducto;
    private int cantidad;
    private double precioUnitario;
}
