package app.deliciousfood.visited;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "visited_stores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VisitedStore {

    @Id
    private String id;

    private String userId;
    private String storeId;

    private Instant visitedAt;
}
