package com.uwutech.www.admin.service;

import com.uwutech.www.admin.dto.PedidoDTO;
import com.uwutech.www.core.model.*;
import com.uwutech.www.core.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoService {

    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private ProductoService productoService;

    /**
     * Registra un nuevo pedido en estado PENDIENTE.
     * En este punto, el stock de los productos NO se modifica.
     */
    @Transactional
    public Pedido registrarPedido(PedidoDTO pedidoDTO) {
        Cliente cliente = clienteRepository.findById(pedidoDTO.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Usuario usuario = usuarioRepository.findById(pedidoDTO.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setUsuario(usuario);
        pedido.setDireccion_entrega(pedidoDTO.getDireccionEntrega());
        pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);

        List<DetallePedido> detalles = new ArrayList<>();
        double totalPedido = 0;

        for (var detalleDTO : pedidoDTO.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecio_unit(detalleDTO.getPrecioUnitario());
            detalle.setSubtotal(detalleDTO.getCantidad() * detalleDTO.getPrecioUnitario());
            detalle.setPedido(pedido);

            detalles.add(detalle);
            totalPedido += detalle.getSubtotal();
        }

        pedido.setTotal(totalPedido);
        pedido.setDetalles(detalles);

        return pedidoRepository.save(pedido);
    }

    /**
     * Cambia el estado de un pedido a ENTREGADO y descuenta el stock de los productos.
     * Esta es la operación que afecta el inventario.
     */
    @Transactional
    public Pedido marcarComoEntregado(Integer idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getEstado() == Pedido.EstadoPedido.ENTREGADO) {
            throw new RuntimeException("El pedido ya fue marcado como entregado.");
        }
        if (pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) {
            throw new RuntimeException("No se puede entregar un pedido cancelado.");
        }

        // Actualizar el stock por cada producto en el detalle
        for (DetallePedido detalle : pedido.getDetalles()) {
            productoService.actualizarStock(detalle.getProducto().getId_producto(), -detalle.getCantidad());
        }

        pedido.setEstado(Pedido.EstadoPedido.ENTREGADO);
        return pedidoRepository.save(pedido);
    }

    /**
     * Cambia el estado de un pedido a CANCELADO.
     * No afecta el stock, ya que nunca se descontó.
     */
    @Transactional
    public Pedido cancelarPedido(Integer idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getEstado() == Pedido.EstadoPedido.ENTREGADO || pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) {
            throw new RuntimeException("El pedido no se puede cancelar.");
        }

        pedido.setEstado(Pedido.EstadoPedido.CANCELADO);
        return pedidoRepository.save(pedido);
    }
}