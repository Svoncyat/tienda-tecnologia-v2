package com.uwutech.www.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminWebController {

    @GetMapping("/")
    public String redirectToDashboard() {
        return "redirect:/admin/dashboard";
    }
    
    @GetMapping("/dashboard")
    public String dashboard() {
        return "admin/dashboard";
    }
    
    @GetMapping("/login")
    public String login() {
        return "admin/login";
    }
    
    @GetMapping("/categorias")
    public String categorias() {
        return "admin/categorias";
    }
    
    @GetMapping("/inventario")
    public String inventario() {
        return "admin/inventario";
    }
    
    @GetMapping("/clientes")
    public String clientes() {
        return "admin/clientes";
    }
    
    @GetMapping("/ventas")
    public String ventas() {
        return "admin/ventas";
    }
    
    @GetMapping("/compras")
    public String compras() {
        return "admin/compras";
    }
    
    @GetMapping("/proveedores")
    public String proveedores() {
        return "admin/proveedores";
    }
    
    @GetMapping("/ofertas")
    public String ofertas() {
        return "admin/ofertas";
    }
    
    @GetMapping("/pedidos")
    public String pedidos() {
        return "admin/pedidos";
    }
    
    @GetMapping("/perfiles")
    public String perfiles() {
        return "admin/perfiles";
    }
    
    @GetMapping("/roles")
    public String roles() {
        return "admin/Roles";
    }
    
    @GetMapping("/caja")
    public String caja() {
        return "admin/caja";
    }
    
    @GetMapping("/reportes")
    public String reportes() {
        return "admin/reportes";
    }
    
    @GetMapping("/configuracion")
    public String configuracion() {
        return "admin/configuracion";
    }
} 