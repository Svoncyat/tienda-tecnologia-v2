package com.uwutech.www.superadmin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SuperadminController {

    @GetMapping("/superadmin/dashboard")
    public String dashboard() {
        return "superadmin/dashboard";
    }

    @GetMapping("/superadmin/Gestion")
    public String gestion() {
        return "superadmin/Gestion";
    }

    @GetMapping("/superadmin/mensajes")
    public String mensajes() {
        return "superadmin/mensajes";
    }

    @GetMapping("/superadmin/reportes")
    public String reportes() {
        return "superadmin/reportes";
    }

    @GetMapping("/superadmin/config")
    public String config() {
        return "superadmin/config";
    }
}