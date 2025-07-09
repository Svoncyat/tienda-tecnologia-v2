package com.uwutech.www.public_site.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/public-site")
public class PublicSiteController {

    @GetMapping({"", "/"})
    public String index() {
        return "public-site/index";
    }

    @GetMapping("/productos")
    public String productos() {
        return "public-site/productos";
    }

    @GetMapping("/servicios")
    public String servicios() {
        return "public-site/servicios";
    }

    @GetMapping("/contacto")
    public String contacto() {
        return "public-site/contacto";
    }

    @GetMapping("/carrito")
    public String carrito() {
        return "public-site/carrito";
    }

    @GetMapping("/favoritos")
    public String favoritos() {
        return "public-site/favoritos";
    }

    @GetMapping("/perfil")
    public String perfil() {
        return "public-site/perfil";
    }
} 