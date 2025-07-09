package com.uwutech.www.admin.controller;


import com.uwutech.www.core.model.Marca;
import com.uwutech.www.core.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    @Autowired
    private MarcaRepository marcaRepository;

    @GetMapping
    public List<MarcaDTO> getAllMarcas() {
        return marcaRepository.findAll().stream().map(marca -> new MarcaDTO(marca)).collect(Collectors.toList());
    }

    @PostMapping
    public Marca createMarca(@RequestBody Marca marca) {
        return marcaRepository.save(marca);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca> updateMarca(@PathVariable Integer id, @RequestBody Marca marcaDetails) {
        return marcaRepository.findById(id)
                .map(marca -> {
                    marca.setNombre(marcaDetails.getNombre());
                    marca.setDescripcion(marcaDetails.getDescripcion());
                    marca.setActivo(marcaDetails.getActivo());
                    Marca updatedMarca = marcaRepository.save(marca);
                    return ResponseEntity.ok(updatedMarca);
                }).orElse(ResponseEntity.notFound().build());
    }
}

// DTO interno
class MarcaDTO {
    public Integer id_marca;
    public String nombre;
    public String descripcion;
    public Boolean activo;
    public String fechaCreacion;
    public int cantidadProductos;
    public MarcaDTO(com.uwutech.www.core.model.Marca marca) {
        this.id_marca = marca.getId_marca();
        this.nombre = marca.getNombre();
        this.descripcion = marca.getDescripcion();
        this.activo = marca.getActivo();
        this.fechaCreacion = marca.getFechaCreacion() != null ? marca.getFechaCreacion().toString() : "";
        this.cantidadProductos = (marca.getProductos() != null) ? marca.getProductos().size() : 0;
    }
}