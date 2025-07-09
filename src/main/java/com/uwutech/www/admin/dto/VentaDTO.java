package com.uwutech.www.admin.dto;

import lombok.Data;
import java.util.List;

@Data
public class VentaDTO {
    private Integer idCliente;
    private Integer idUsuario;
    private Integer idCaja;
    private String tipoComprobante;
    private String tipoPago;
    private List<DetalleVentaDTO> detalles;
}