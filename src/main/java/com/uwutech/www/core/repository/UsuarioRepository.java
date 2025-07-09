package com.uwutech.www.core.repository;

import com.uwutech.www.core.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Usuario findByUsernameAndPasswordHash(String username, String passwordHash);
}