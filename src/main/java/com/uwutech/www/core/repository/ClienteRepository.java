package com.uwutech.www.core.repository;

import com.uwutech.www.core.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    
    @Query("SELECT c FROM Cliente c WHERE c.numero_documento = :numero_documento")
    Optional<Cliente> findByNumeroDocumento(@Param("numero_documento") String numeroDocumento);
    
    @Query("SELECT c FROM Cliente c WHERE c.activo = true")
    java.util.List<Cliente> findAllActive();
}