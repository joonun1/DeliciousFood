package app.deliciousfood.menu;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "menus")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Menu {

    @Id
    private String id;

    // 가게 FK (Store._id)
    private String storeId;

    private String name;
    private BigDecimal price;
    private String description;
    private String imageUrl;

    private Instant createdAt;
    private Instant updatedAt;
}
