package app.deliciousfood.review;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review r = opt.get();
        if (req.rating() != null) r.setRating(req.rating());
        if (req.content() != null) r.setContent(req.content());
        // updatedAt 필드가 필요하다면 엔티티에 추가해서 여기서 같이 갱신

        Review saved = reviewRepository.save(r);
        return ResponseEntity.ok(saved);
    }

    // ---------- 리뷰 삭제 ----------
    // DELETE /api/reviews/{reviewId}
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            return ResponseEntity.notFound().build();
        }
        reviewRepository.deleteById(reviewId);
        return ResponseEntity.noContent().build();
    }
}
