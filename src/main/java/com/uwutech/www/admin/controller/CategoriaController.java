package com.uwutech.www.admin.controller;



import com.uwutech.www.core.model.Categoria;
import com.uwutech.www.core.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public List<CategoriaDTO> getAllCategorias() {
        return categoriaRepository.findAll().stream().map(cat -> new CategoriaDTO(cat)).collect(Collectors.toList());
    }

    @PostMapping
    public Categoria createCategoria(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> updateCategoria(@PathVariable Integer id, @RequestBody Categoria categoriaDetails) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNombre(categoriaDetails.getNombre());
                    categoria.setDescripcion(categoriaDetails.getDescripcion());
                    categoria.setActivo(categoriaDetails.getActivo());
                    Categoria updatedCategoria = categoriaRepository.save(categoria);
                    return ResponseEntity.ok(updatedCategoria);
                }).orElse(ResponseEntity.notFound().build());
    }
}

// DTO interno
class CategoriaDTO {
    public Integer id_categoria;
    public String nombre;
    public String descripcion;
    public Boolean activo;
    public String fechaCreacion;
    public int cantidadProductos;
    public CategoriaDTO(com.uwutech.www.core.model.Categoria cat) {
        this.id_categoria = cat.getId_categoria();
        this.nombre = cat.getNombre();
        this.descripcion = cat.getDescripcion();
        this.activo = cat.getActivo();
        this.fechaCreacion = cat.getFechaCreacion() != null ? cat.getFechaCreacion().toString() : "";
        this.cantidadProductos = (cat.getProductos() != null) ? cat.getProductos().size() : 0;
    }
}