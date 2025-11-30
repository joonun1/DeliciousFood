package app.deliciousfood.user;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id
    private String id;

    @Indexed(unique = true)           // 이메일 유니크 인덱스
    private String email;

    private String name;
    private String passwordHash;
    private String nation;
    private String language;

    private Instant createdAt;
}
