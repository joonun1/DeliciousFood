package app.deliciousfood.user;

import app.deliciousfood.plan.PlanToGo;
import app.deliciousfood.plan.PlanToGoRepository;
import app.deliciousfood.review.Review;
import app.deliciousfood.review.ReviewRepository;
import app.deliciousfood.store.Store;
import app.deliciousfood.store.StoreRepository;
import app.deliciousfood.like.LikeRepository;
import app.deliciousfood.visited.VisitedStore;
import app.deliciousfood.visited.VisitedStoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserRepository userRepo;
    private final ReviewRepository reviewRepo;
    private final LikeRepository likeRepo;
    private final StoreRepository storeRepo;
    private final VisitedStoreRepository visitedRepo;
    private final PlanToGoRepository planRepo;

    // ----------------------------------
    // ⭐ 1) 프로필 정보 + 통계
    // GET /api/users/{userId}/profile
    // ----------------------------------
    @GetMapping("/{userId}/profile")
    public UserProfileResponse getProfile(@PathVariable String userId) {

        var user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long reviewCount = reviewRepo.findByUserIdOrderByCreatedAtDesc(userId).size();
        long likeCount = likeRepo.findByUserId(userId).size();
        long visitedCount = visitedRepo.findByUserId(userId).size();

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getNation(),
                user.getLanguage(),
                reviewCount,
                likeCount,
                visitedCount
        );
    }

    // ----------------------------------
    // ⭐ 3) 다녀온 가게 목록
    // GET /api/users/{userId}/visited
    // ----------------------------------
    @GetMapping("/{userId}/visited")
    public List<Store> getVisitedStores(@PathVariable String userId) {
        return visitedRepo.findByUserId(userId)
                .stream()
                .map(v -> storeRepo.findById(v.getStoreId()).orElse(null))
                .filter(s -> s != null)
                .toList();
    }

    // 다녀온 가게 등록 (테스트용)
    @PostMapping("/{userId}/visited/{storeId}")
    public void addVisited(@PathVariable String userId, @PathVariable String storeId) {
        visitedRepo.save(
                VisitedStore.builder()
                        .userId(userId)
                        .storeId(storeId)
                        .visitedAt(Instant.now())
                        .build()
        );
    }

    // ----------------------------------
    // ⭐ 4) 가볼 가게 목록
    // GET /api/users/{userId}/plan-to-go
    // ----------------------------------
    @GetMapping("/{userId}/plan-to-go")
    public List<Store> getPlanToGoStores(@PathVariable String userId) {
        return planRepo.findByUserId(userId)
                .stream()
                .map(p -> storeRepo.findById(p.getStoreId()).orElse(null))
                .filter(s -> s != null)
                .toList();
    }

    // 가볼 가게 추가
    @PostMapping("/{userId}/plan-to-go/{storeId}")
    public void addPlanToGo(@PathVariable String userId, @PathVariable String storeId) {
        planRepo.save(
                PlanToGo.builder()
                        .userId(userId)
                        .storeId(storeId)
                        .addedAt(Instant.now())
                        .build()
        );
    }

    // DTO
    public record UserProfileResponse(
            String userId,
            String email,
            String name,
            String nation,
            String language,
            long reviewCount,
            long likeCount,
            long visitedCount
    ) {}
}
