package app.deliciousfood.store;

import jakarta.persistence.*;
import lombok.Getter; import lombok.NoArgsConstructor; import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity @Table(name = "stores")
@Getter @Setter @NoArgsConstructor
public class Store {
    @Id @GeneratedValue @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(nullable = false) private String name;
    private String address;
    private String description;

    @Column(name="rating_avg")  private BigDecimal ratingAvg;
    @Column(name="rating_count") private Integer ratingCount;

    // Supabase: geography(Point,4326)
    @Column(name="geom", columnDefinition = "geography(Point,4326)", nullable = false)
    private Point location;

    @Column(name="created_at") private OffsetDateTime createdAt;
}
