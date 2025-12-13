package app.deliciousfood.plan;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "plan_to_go")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanToGo {

    @Id
    private String id;

    private String userId;
    private String storeId;

    private Instant addedAt;
}

