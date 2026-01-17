package app.deliciousfood.api;

import app.deliciousfood.store.Store;
import app.deliciousfood.store.StoreRepository;
import app.deliciousfood.review.Review;
import app.deliciousfood.review.ReviewRepository;

import lombok.RequiredArgsConstructor;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StoreController {

    private final StoreRepository storeRepo;
    private final ReviewRepository reviewRepo;
    private final GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);

    public record CreateStoreReq(String name, String address, String description, double lat, double lng) {}

    @PostMapping("/stores")
    public Store createStore(@RequestBody CreateStoreReq req) {
        Point p = gf.createPoint(new Coordinate(req.lng(), req.lat())); // lng,lat 순
        Store s = new Store();
        s.setName(req.name());
        s.setAddress(req.address());
        s.setDescription(req.description());
        s.setLocation(p);
        return storeRepo.save(s);
    }

    @GetMapping("/stores/nearby")
    public List<Store> nearby(
            @RequestParam double lat, @RequestParam double lng,
            @RequestParam(defaultValue = "2000") int radiusM,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return storeRepo.findNearby(lat, lng, radiusM, limit);
    }

    public record CreateReviewReq(UUID storeId, UUID userId, int rating, String content) {}

    @PostMapping("/reviews")
    public Review createReview(@RequestBody CreateReviewReq req) {
        Review r = new Review();
        r.setStoreId(req.storeId());
        r.setUserId(req.userId());
        r.setRating(req.rating());
        r.setContent(req.content());
        return reviewRepo.save(r);
    }

    @GetMapping("/stores/{storeId}/reviews")
    public List<Review> listReviews(@PathVariable UUID storeId) {
        return reviewRepo.findByStoreIdOrderByCreatedAtDesc(storeId);
    }
}
