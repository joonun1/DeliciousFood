package app.deliciousfood.store;

import app.deliciousfood.review.Review;
import app.deliciousfood.review.ReviewRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StoreController {

    private final StoreRepository storeRepo;
    private final ReviewRepository reviewRepo;

    public record CreateStoreReq(String name, String address, String description, double lat, double lng) {}

    @PostMapping("/stores")
    public Store createStore(@RequestBody CreateStoreReq req) {
        // GeoJsonPoint는 (lng, lat)
        Store s = new Store();
        s.setName(req.name());
        s.setAddress(req.address());
        s.setDescription(req.description());
        s.setLocation(new GeoJsonPoint(req.lng(), req.lat()));
        s.setCreatedAt(OffsetDateTime.now());
        return storeRepo.save(s);
    }

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

    public record CreateReviewReq(String storeId, String userId, int rating, String content) {}

    @PostMapping("/reviews")
    public Review createReview(@RequestBody CreateReviewReq req) {
        Review r = new Review();
        r.setStoreId(req.storeId());
        r.setUserId(req.userId());
        r.setRating(req.rating());
        r.setContent(req.content());
        r.setCreatedAt(OffsetDateTime.now());
        return reviewRepo.save(r);
    }

    @GetMapping("/stores/{storeId}/reviews")
    public List<Review> listReviews(@PathVariable String storeId) {
        return reviewRepo.findByStoreIdOrderByCreatedAtDesc(storeId);
    }
}
