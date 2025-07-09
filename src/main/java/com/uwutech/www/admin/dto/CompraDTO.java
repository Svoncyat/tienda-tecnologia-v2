package com.uwutech.www.admin.dto;
import lombok.Data;
import java.util.List;

@Data
public class CompraDTO {
    private Integer idProveedor;
    private Integer idUsuarioReceptor;
    private String tipoComprobante;
    private String nroComprobante;
    private List<DetalleCompraDTO> detalles;
}