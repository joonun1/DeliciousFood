package app.deliciousfood.store;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Document(collection = "stores")
@Getter @Setter @NoArgsConstructor
public class Store {

    @Id
    private String id;

    private String name;
    private String address;
    private String description;

    private BigDecimal ratingAvg;
    private Integer ratingCount;

    // 위도/경도 저장용 GeoJSON 포인트 (lng, lat 순)
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;

    private OffsetDateTime createdAt;
}
