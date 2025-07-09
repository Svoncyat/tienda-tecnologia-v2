package com.uwutech.www.core.repository;

import com.uwutech.www.core.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    // Método para login
    Usuario findByUsernameAndPasswordHash(String username, String passwordHash);
    
    // Métodos para validar unicidad
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByDni(String dni);
    
    // Método para buscar usuarios activos
    @Query("SELECT u FROM Usuario u WHERE u.activo = true")
    List<Usuario> findAllActive();
    
    // Método simple para usuarios activos
    List<Usuario> findByActivoTrue();
    
    // Método para buscar por rol usando @Query (recomendado)
    @Query("SELECT u FROM Usuario u WHERE u.rol.id_rol = :rolId")
    List<Usuario> findByRol_Id_rol(@Param("rolId") Integer id_rol);
    
    // Método para buscar por texto en múltiples campos
    @Query("SELECT u FROM Usuario u WHERE " +
           "LOWER(u.nombres) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(u.apellidos) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "u.dni LIKE CONCAT('%', :texto, '%')")
    List<Usuario> findByTextoEnCualquierCampo(@Param("texto") String texto);
    
    // Método largo para compatibilidad
    default List<Usuario> findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCaseOrUsernameContainingIgnoreCase(
            String nombres, String apellidos, String username) {
        return findByTextoEnCualquierCampo(nombres); // Usamos el primer parámetro como texto de búsqueda
    }
    
    // Método para buscar por múltiples criterios
    @Query("SELECT u FROM Usuario u WHERE " +
           "(:nombres IS NULL OR LOWER(u.nombres) LIKE LOWER(CONCAT('%', :nombres, '%'))) AND " +
           "(:apellidos IS NULL OR LOWER(u.apellidos) LIKE LOWER(CONCAT('%', :apellidos, '%'))) AND " +
           "(:username IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%'))) AND " +
           "(:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:dni IS NULL OR u.dni LIKE CONCAT('%', :dni, '%')) AND " +
           "(:activo IS NULL OR u.activo = :activo)")
    List<Usuario> findByCriteria(
        @Param("nombres") String nombres,
        @Param("apellidos") String apellidos,
        @Param("username") String username,
        @Param("email") String email,
        @Param("dni") String dni,
        @Param("activo") Boolean activo
    );
}