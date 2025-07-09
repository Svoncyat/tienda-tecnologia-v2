package com.uwutech.www.core.repository;


import com.uwutech.www.core.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    // JpaRepository nos da gratis los métodos: findAll, findById, save, delete, etc.
    // Aquí puedes añadir métodos de búsqueda personalizados si los necesitas.
}