package app.deliciousfood.review;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;

@Document(collection = "reviews")
@Getter @Setter @NoArgsConstructor
public class Review {

    @Id
    private String id;

    private String storeId;   // 참조는 문자열로
    private String userId;

    private Integer rating;   // 1~5
    private String content;

    private OffsetDateTime createdAt;
}
