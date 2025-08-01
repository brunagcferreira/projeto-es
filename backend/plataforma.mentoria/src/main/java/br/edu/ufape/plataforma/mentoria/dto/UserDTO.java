package br.edu.ufape.plataforma.mentoria.dto;
import jakarta.validation.constraints.NotBlank;
import br.edu.ufape.plataforma.mentoria.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserDTO {

    @NotBlank(message = "O e-mail não pode ser vazio")
    @Email(message = "Formato de e-mail inválido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, message = "A senha deve possuir pelo menos 8 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d!@#$%^&*(),.?:{}|<>]{8,}$",
            message = "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial")
    private String password;

    private UserRole role;

    public UserDTO() {
        }

    public UserDTO(String email, String password, UserRole role) {
            this.email = email;
            this.password = password;
            this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
