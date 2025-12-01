package app.deliciousfood.review;

import app.deliciousfood.store.Store;
import app.deliciousfood.store.StoreRepository;
import lombok.RequiredArgsConstructor;
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
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final StoreRepository storeRepo;

    // ---------- DTO들 ----------

    public record CreateReviewReq(
            String userId,
            Integer rating,
            String content,
            List<String> imageUrls
    ) {}

    public record UpdateReviewReq(
            Integer rating,
            String content,
            List<String> imageUrls
    ) {}

    // ---------- 리뷰 생성 ----------
    // POST /api/stores/{storeId}/reviews
    @PostMapping("/stores/{storeId}/reviews")
    public ResponseEntity<Review> createReview(
            @PathVariable String storeId,
            @RequestBody CreateReviewReq req
    ) {
        Review r = new Review();
        r.setStoreId(storeId);
        r.setUserId(req.userId());
        r.setRating(req.rating());
        r.setContent(req.content());
        r.setImageUrls(req.imageUrls());
        r.setCreatedAt(Instant.now());

        Review saved = reviewRepository.save(r);

        // ⭐ 스토어 평점 재계산
        recalcStoreRating(storeId);

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
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable String reviewId,
            @RequestBody UpdateReviewReq req
    ) {
        Optional<Review> opt = reviewRepository.findById(reviewId);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review r = opt.get();
        if (req.rating() != null) r.setRating(req.rating());
        if (req.content() != null) r.setContent(req.content());
        if (req.imageUrls() != null) r.setImageUrls(req.imageUrls());

        Review saved = reviewRepository.save(r);

        // ⭐ 이 리뷰가 속한 가게 평점 재계산
        recalcStoreRating(r.getStoreId());

        return ResponseEntity.ok(saved);
    }

    // ---------- 리뷰 삭제 ----------
    // DELETE /api/reviews/{reviewId}
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        Optional<Review> opt = reviewRepository.findById(reviewId);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review r = opt.get();
        reviewRepository.deleteById(reviewId);

        // ⭐ 삭제 후에도 가게 평점 재계산
        recalcStoreRating(r.getStoreId());

        return ResponseEntity.noContent().build();
    }

    // ---------- 헬퍼: 스토어 평점 재계산 ----------
    private void recalcStoreRating(String storeId) {
        List<Review> list = reviewRepository.findByStoreIdOrderByCreatedAtDesc(storeId);

        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found: " + storeId));

        if (list.isEmpty()) {
            store.setRating(0.0);
            store.setRatingCount(0);
        } else {
            double sum = 0.0;
            for (Review rv : list) {
                if (rv.getRating() != null) {
                    sum += rv.getRating();
                }
            }
            double avg = sum / list.size();
            // 소수점 한 자리까지만 (예: 4.7)
            avg = Math.round(avg * 10.0) / 10.0;

            store.setRating(avg);
            store.setRatingCount(list.size());
        }

        storeRepo.save(store);
    }
}
