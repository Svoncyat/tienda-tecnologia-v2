package com.uwutech.www.admin.dto;

import lombok.Data;
import java.util.List;

@Data
public class PedidoDTO {
    private Integer idCliente;
    private Integer idUsuario;
    private String direccionEntrega;
    private List<DetallePedidoDTO> detalles;
}