package app.deliciousfood.like;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "likes")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class Like {

        @Id
        private String id;

        private String userId;
        private String storeId;

        private Instant createdAt;
    }


