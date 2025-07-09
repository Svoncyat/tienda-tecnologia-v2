package com.uwutech.www.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DevolucionesController {

    @GetMapping("/admin/devoluciones")
    public String despacho() {
        return "admin/devoluciones";
    }
}