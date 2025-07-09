package com.uwutech.www.core.repository;

import com.uwutech.www.core.model.Caja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CajaRepository extends JpaRepository<Caja, Integer> {}