package com.uwutech.www.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HistorialController {

    @GetMapping("/admin/historial")
    public String despacho() {
        return "/admin/historial";
    }
}