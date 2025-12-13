package app.deliciousfood.review;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;

@Document(collection = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    private String id;

    // 어떤 가게에 대한 리뷰인지 (Store._id)
    private String storeId;

    // 어떤 유저가 남긴 리뷰인지 (User._id)
    private String userId;

    // 평점 (1~5)
    private Integer rating;

    // 리뷰 내용
    private String content;

    // (선택) 리뷰 이미지 URL들
    private List<String> imageUrls;

    // 작성 일시
    private Instant createdAt;
}
