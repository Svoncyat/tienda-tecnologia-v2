package com.uwutech.www.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DespachoController {

    @GetMapping("/admin/despacho")
    public String despacho() {
        return "admin/despacho";
    }
}