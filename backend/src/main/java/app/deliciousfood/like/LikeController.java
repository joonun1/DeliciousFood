package app.deliciousfood.like;

import app.deliciousfood.store.Store;
import app.deliciousfood.store.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LikeController {

    private final LikeRepository likeRepo;
    private final StoreRepository storeRepo;

    // ---------------------
    // 1) 좋아요 추가
    // ---------------------
    @PostMapping("/stores/{storeId}/like")
    public ResponseEntity<?> addLike(
            @PathVariable String storeId,
            @RequestParam String userId     // ⭐️ 아직 auth 없으니 쿼리 파라미터로 받음
    ) {
        // 이미 좋아요 되어있으면 무시
        if (likeRepo.existsByUserIdAndStoreId(userId, storeId)) {
            return ResponseEntity.ok("Already liked");
        }

        Like like = Like.builder()
                .storeId(storeId)
                .userId(userId)
                .createdAt(Instant.now())
                .build();

        likeRepo.save(like);

        // likedCount 다시 계산
        updateStoreLikeCount(storeId);

        return ResponseEntity.ok("Liked");
    }

    // ---------------------
    // 2) 좋아요 취소
    // ---------------------
    @DeleteMapping("/stores/{storeId}/like")
    public ResponseEntity<?> removeLike(
            @PathVariable String storeId,
            @RequestParam String userId
    ) {

        likeRepo.deleteByUserIdAndStoreId(userId, storeId);

        // count 다시 갱신
        updateStoreLikeCount(storeId);

        return ResponseEntity.ok("Unliked");
    }

    // ---------------------
    // 3) 유저가 좋아한 가게 목록 조회
    // ---------------------
    @GetMapping("/users/{userId}/likes/stores")
    public List<Store> getUserLikedStores(@PathVariable String userId) {

        List<Like> likes = likeRepo.findByUserId(userId);

        return likes.stream()
                .map(like -> storeRepo.findById(like.getStoreId()).orElse(null))
                .filter(store -> store != null)
                .toList();
    }

    // ---------------------
    // 헬퍼: likedCount 갱신
    // ---------------------
    private void updateStoreLikeCount(String storeId) {
        long count = likeRepo.countByStoreId(storeId);

        storeRepo.findById(storeId).ifPresent(store -> {
            store.setLikedCount((int) count);
            store.setUpdatedAt(Instant.now());
            storeRepo.save(store);
        });
    }
}

