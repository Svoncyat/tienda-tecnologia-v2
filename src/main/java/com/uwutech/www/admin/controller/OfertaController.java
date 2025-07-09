package com.uwutech.www.admin.controller;


import com.uwutech.www.core.model.Oferta;
import com.uwutech.www.core.repository.OfertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ofertas")
public class OfertaController {

    @Autowired
    private OfertaRepository ofertaRepository;

    @GetMapping
    public List<Oferta> getAllOfertas() {
        return ofertaRepository.findAll();
    }

    @PostMapping
    public Oferta createOferta(@RequestBody Oferta oferta) {
        return ofertaRepository.save(oferta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Oferta> updateOferta(@PathVariable Integer id, @RequestBody Oferta ofertaDetails) {
        return ofertaRepository.findById(id)
                .map(oferta -> {
                    oferta.setNombre(ofertaDetails.getNombre());
                    oferta.setDescripcion(ofertaDetails.getDescripcion());
                    oferta.setTipoOferta(ofertaDetails.getTipoOferta());
                    oferta.setValor(ofertaDetails.getValor());
                    oferta.setFechaInicio(ofertaDetails.getFechaInicio());
                    oferta.setFechaFin(ofertaDetails.getFechaFin());
                    oferta.setActivo(ofertaDetails.getActivo());
                    return ResponseEntity.ok(ofertaRepository.save(oferta));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOferta(@PathVariable Integer id) {
        return ofertaRepository.findById(id).map(oferta -> {
            ofertaRepository.delete(oferta);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}