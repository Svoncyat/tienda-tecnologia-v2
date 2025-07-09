package com.uwutech.www.admin.controller;

import com.uwutech.www.core.model.Permiso;
import com.uwutech.www.core.repository.PermisoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/permisos")
public class PermisoController {

    @Autowired
    private PermisoRepository permisoRepository;

    @GetMapping
    public List<Permiso> getAllPermisos() {
        return permisoRepository.findAll();
    }
}