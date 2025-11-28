package app.deliciousfood.review;

import app.deliciousfood.store.Store;
import app.deliciousfood.store.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final StoreRepository storeRepo;

    // ---------- 리뷰 생성 ----------
    // POST /api/stores/{storeId}/reviews
    public record CreateReviewReq(String userId, int rating, String content) {}

    @PostMapping("/stores/{storeId}/reviews")
    public ResponseEntity<Review> createReview(
            @PathVariable String storeId,
            @RequestBody CreateReviewReq req
    ) {
        Review r = new Review();
        r.setStoreId(storeId);             // 가게 FK
        r.setUserId(req.userId());         // 유저 FK
        r.setRating(req.rating());
        r.setContent(req.content());
        r.setCreatedAt(Instant.now());
        r.setUpdatedAt(Instant.now());

        Review saved = reviewRepository.save(r);

        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        int oldCount = store.getRatingCount() == null ? 0 : store.getRatingCount();
        BigDecimal oldAvg = store.getRatingAvg() == null ? BigDecimal.ZERO : store.getRatingAvg();

        BigDecimal newAvg = oldAvg.multiply(BigDecimal.valueOf(oldCount))
                .add(BigDecimal.valueOf(req.rating()))
                .divide(BigDecimal.valueOf(oldCount + 1), 2, RoundingMode.HALF_UP);

        store.setRatingAvg(newAvg);
        store.setRatingCount(oldCount + 1);

        storeRepo.save(store);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // ---------- 가게 기준 리뷰 목록 ----------
    // GET /api/stores/{storeId}/reviews
    @GetMapping("/stores/{storeId}/reviews")
    public List<Review> listByStore(@PathVariable String storeId) {
        return reviewRepository.findByStoreIdOrderByCreatedAtDesc(storeId);
    }

    // ---------- 유저 기준 리뷰 목록 ----------
    // GET /api/users/{userId}/reviews
    @GetMapping("/users/{userId}/reviews")
    public List<Review> listByUser(@PathVariable String userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ---------- 리뷰 한 개 조회 ----------
    // GET /api/reviews/{reviewId}
    @GetMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> getOne(@PathVariable String reviewId) {
        Optional<Review> opt = reviewRepository.findById(reviewId);
        return opt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------- 리뷰 수정 ----------
    // PUT /api/reviews/{reviewId}
    public record UpdateReviewReq(Integer rating, String content) {}

    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable String reviewId,
            @RequestBody UpdateReviewReq req
    ) {
        Optional<Review> opt = reviewRepository.findById(reviewId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Review r = opt.get();
        if (req.rating() != null) r.setRating(req.rating());
        if (req.content() != null) r.setContent(req.content());
        Review saved = reviewRepository.save(r);

        // 🔥 Store 평점 전체 재계산
        recalcStoreRating(r.getStoreId());

        return ResponseEntity.ok(saved);
    }

    // ---------- 리뷰 삭제 ----------
    // DELETE /api/reviews/{reviewId}
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        Optional<Review> opt = reviewRepository.findById(reviewId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Review r = opt.get();
        reviewRepository.deleteById(reviewId);

        // 🔥 삭제됐으니 평균 다시 계산
        recalcStoreRating(r.getStoreId());

        return ResponseEntity.noContent().build();
    }

    private void recalcStoreRating(String storeId) {
        List<Review> list = reviewRepository.findByStoreIdOrderByCreatedAtDesc(storeId);

        if (list.isEmpty()) {
            Store store = storeRepo.findById(storeId).orElseThrow();
            store.setRatingAvg(BigDecimal.ZERO);
            store.setRatingCount(0);
            storeRepo.save(store);
            return;
        }

        BigDecimal sum = BigDecimal.ZERO;
        for (Review rv : list) {
            sum = sum.add(BigDecimal.valueOf(rv.getRating()));
        }

        BigDecimal avg = sum.divide(BigDecimal.valueOf(list.size()), 2, RoundingMode.HALF_UP);

        Store store = storeRepo.findById(storeId).orElseThrow();
        store.setRatingAvg(avg);
        store.setRatingCount(list.size());
        storeRepo.save(store);
    }
}
