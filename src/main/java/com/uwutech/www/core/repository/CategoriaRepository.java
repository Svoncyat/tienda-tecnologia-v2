package com.uwutech.www.core.repository;

// CategoriaRepository.java


import com.uwutech.www.core.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {}