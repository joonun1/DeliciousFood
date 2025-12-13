package app.deliciousfood.store;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "stores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    private String id;

    private String name;

    // 가게 대표 이미지 URL (프론트의 img)
    private String img;

    // 평균 평점 (프론트 rating)
    private Double rating;        // ex) 4.7

    // 평점 개수 (프론트엔 안 나와도 내부 계산용)
    private Integer ratingCount;

    private String phone;        // 전화번호
    private String hours;        // 영업시간 (예: "11:30 - 21:00")
    private String address;      // 주소

    private Integer likedCount;  // 좋아요 수

    private List<String> tags;   // ["Local Pick", "Pork", "Preference 98%"]

    // 위치 (위도, 경도)
    private Double lat;
    private Double lng;

    private Instant createdAt;
    private Instant updatedAt;
}
