package app.deliciousfood.store;

import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/test/stores")
@RequiredArgsConstructor
public class StoreTestController {

    private final StoreRepository storeRepository;

    @PostMapping
    public ResponseEntity<?> createStore(@RequestBody StoreCreateRequest req) {
        Store store = new Store();
        store.setName(req.name());
        store.setAddress(req.address());
        store.setDescription(req.description());

        // 위도, 경도 → Point 타입으로 변환
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point point = geometryFactory.createPoint(new Coordinate(req.longitude(), req.latitude()));
        store.setLocation(point);

        store.setCreatedAt(OffsetDateTime.now());
        storeRepository.save(store);

        return ResponseEntity.status(HttpStatus.CREATED).body(new SimpleMessage("store created"));
    }

    // DTO 클래스
    public record StoreCreateRequest(
            String name,
            String address,
            String description,
            double latitude,
            double longitude
    ) {}

    @GetMapping("/{id}")
    public ResponseEntity<?> getStore(@PathVariable UUID id) {
        return storeRepository.findById(id)
                .map(StoreResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping
    public List<StoreResponse> getAllStores() {
        return storeRepository.findAll().stream()
                .map(StoreResponse::from)
                .toList();
    }

    public record StoreResponse(
            UUID id,
            String name,
            String address,
            String description,
            double latitude,
            double longitude,
            BigDecimal ratingAvg,
            Integer ratingCount
    ) {
        public static StoreResponse from(Store store) {
            return new StoreResponse(
                    store.getId(),
                    store.getName(),
                    store.getAddress(),
                    store.getDescription(),
                    store.getLocation().getY(), // 위도
                    store.getLocation().getX(), // 경도
                    store.getRatingAvg(),
                    store.getRatingCount()
            );
        }
    }

    public record SimpleMessage(String message) {}
}
