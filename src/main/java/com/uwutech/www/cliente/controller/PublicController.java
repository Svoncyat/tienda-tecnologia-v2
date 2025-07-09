package com.uwutech.www.cliente.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PublicController {

    @GetMapping
    public String home() {
        return "redirect:/admin/login";
    }
    
    @GetMapping("/tienda")
    public String tienda() {
        return "public/tienda";
    }
    
    @GetMapping("/productos")
    public String productos() {
        return "public/productos";
    }
    
    @GetMapping("/carrito")
    public String carrito() {
        return "public/carrito";
    }
} 