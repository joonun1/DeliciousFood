package app.deliciousfood.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class User {
    @Id @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    // DB 컬럼명과 매핑
    @Column(name = "password_hash")
    private String passwordHash;

    private String name;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "nation")
    private String nation;
}
