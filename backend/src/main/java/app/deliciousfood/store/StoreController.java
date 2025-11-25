package app.deliciousfood.store;

import app.deliciousfood.review.Review;
import app.deliciousfood.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StoreController {

    private final StoreRepository storeRepo;
    private final ReviewRepository reviewRepo;

    // ---------- Create ----------
    public record CreateStoreReq(String name, String address, String description, double lat, double lng) {}

    @PostMapping("/stores")
    public Store createStore(@RequestBody CreateStoreReq req) {
        Store s = new Store();
        s.setName(req.name());
        s.setAddress(req.address());
        s.setDescription(req.description());
        s.setLocation(new GeoJsonPoint(req.lng(), req.lat())); // (lng, lat)
        s.setCreatedAt(Instant.now());                         // Instant 로 변경
        return storeRepo.save(s);
    }

    // ---------- Read: 단건 ----------
    @GetMapping("/stores/{id}")
    public ResponseEntity<Store> getStore(@PathVariable String id) {
        return storeRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------- Read: 목록(옵션 q=검색) ----------
    @GetMapping("/stores")
    public List<Store> listStores(@RequestParam(defaultValue = "") String q) {
        if (q.isBlank()) {
            return storeRepo.findAll();
        }
        return storeRepo.findByNameContainingIgnoreCase(q);
    }

    // ---------- Update ----------
    public record UpdateStoreReq(
            String name,
            String address,
            String description,
            Double lat,
            Double lng
    ) {}

    @PutMapping("/stores/{id}")
    public ResponseEntity<Store> updateStore(@PathVariable String id, @RequestBody UpdateStoreReq req) {
        Optional<Store> opt = storeRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Store s = opt.get();
        if (req.name() != null) s.setName(req.name());
        if (req.address() != null) s.setAddress(req.address());
        if (req.description() != null) s.setDescription(req.description());
        if (req.lat() != null && req.lng() != null) {
            s.setLocation(new GeoJsonPoint(req.lng(), req.lat()));
        }
        Store saved = storeRepo.save(s);
        return ResponseEntity.ok(saved);
    }

    // ---------- Delete ----------
    @DeleteMapping("/stores/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable String id) {
        if (!storeRepo.existsById(id)) return ResponseEntity.notFound().build();
        storeRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- Nearby(기존) ----------
    @GetMapping("/stores/nearby")
    public List<Store> nearby(
            @RequestParam double lat, @RequestParam double lng,
            @RequestParam(defaultValue = "2000") int radiusM,
            @RequestParam(defaultValue = "20") int limit
    ) {
        Point p = new Point(lng, lat); // (lng, lat)
        Distance d = new Distance(radiusM / 1000.0, Metrics.KILOMETERS);
        return storeRepo.findByLocationNear(p, d, PageRequest.of(0, limit));
    }

    /* ---------- 리뷰 (기존) ----------
    public record CreateReviewReq(String storeId, String userId, int rating, String content) {}

    @PostMapping("/reviews")
    public Review createReview(@RequestBody CreateReviewReq req) {
        Review r = new Review();
        r.setStoreId(req.storeId());
        r.setUserId(req.userId());
        r.setRating(req.rating());
        r.setContent(req.content());
        r.setCreatedAt(OffsetDateTime.from(Instant.now())); // Instant 로 변경
        return reviewRepo.save(r);
    }

    @GetMapping("/stores/{storeId}/reviews")
    public List<Review> listReviews(@PathVariable String storeId) {
        return reviewRepo.findByStoreIdOrderByCreatedAtDesc(storeId);
    }
     */
}
