package app.deliciousfood.store;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreRepository storeRepo;

    // ---------- 가게 생성 ----------
    // POST /api/stores
    @PostMapping
    public ResponseEntity<Store> createStore(@RequestBody CreateStoreReq req) {
        Store s = new Store();
        s.setName(req.name());
        s.setImg(req.img());
        s.setPhone(req.phone());
        s.setHours(req.hours());
        s.setAddress(req.address());
        s.setLat(req.lat());
        s.setLng(req.lng());
        s.setTags(req.tags());

        // 초기값 설정
        s.setRating(0.0);
        s.setRatingCount(0);
        s.setLikedCount(0);

        s.setCreatedAt(Instant.now());
        s.setUpdatedAt(Instant.now());

        Store saved = storeRepo.save(s);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // ---------- 가게 전체 목록 ----------
    // GET /api/stores
    @GetMapping
    public List<Store> listStores() {
        return storeRepo.findAll();
    }

    // ---------- 가게 하나 조회 ----------
    // GET /api/stores/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Store> getStore(@PathVariable String id) {
        return storeRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------- 가게 수정 ----------
    // PUT /api/stores/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Store> updateStore(
            @PathVariable String id,
            @RequestBody UpdateStoreReq req
    ) {
        return storeRepo.findById(id)
                .map(store -> {
                    if (req.name() != null) store.setName(req.name());
                    if (req.img() != null) store.setImg(req.img());
                    if (req.phone() != null) store.setPhone(req.phone());
                    if (req.hours() != null) store.setHours(req.hours());
                    if (req.address() != null) store.setAddress(req.address());
                    if (req.lat() != null) store.setLat(req.lat());
                    if (req.lng() != null) store.setLng(req.lng());
                    if (req.tags() != null) store.setTags(req.tags());
                    if (req.likedCount() != null) store.setLikedCount(req.likedCount());
                    if (req.rating() != null) store.setRating(req.rating());
                    if (req.ratingCount() != null) store.setRatingCount(req.ratingCount());

                    store.setUpdatedAt(Instant.now());
                    Store saved = storeRepo.save(store);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------- 가게 삭제 ----------
    // DELETE /api/stores/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable String id) {
        if (!storeRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        storeRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------- 가게 검색 ----------
    // GET /api/stores/search?q=...&tag=...&lat=..&lng=..&radiusM=2000&limit=20
    @GetMapping("/search")
    public List<StoreSearchRes> searchStores(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(defaultValue = "2000") int radiusM,
            @RequestParam(defaultValue = "20") int limit
    ) {
        String keyword = (q == null) ? "" : q.trim().toLowerCase();
        String tagFilter = (tag == null) ? "" : tag.trim().toLowerCase();

        List<Store> all = storeRepo.findAll();

        return all.stream()
                .filter(s -> {
                    // 텍스트 검색 (이름 / 주소 / 태그 문자열)
                    if (!keyword.isEmpty()) {
                        String name = s.getName() == null ? "" : s.getName().toLowerCase();
                        String address = s.getAddress() == null ? "" : s.getAddress().toLowerCase();
                        String tagsStr = (s.getTags() == null ? List.<String>of() : s.getTags())
                                .stream()
                                .map(t -> t == null ? "" : t.toLowerCase())
                                .reduce("", (a, b) -> a + " " + b);

                        if (!name.contains(keyword)
                                && !address.contains(keyword)
                                && !tagsStr.contains(keyword)) {
                            return false;
                        }
                    }

                    // 태그 필터 (정확 일치, 대소문자 무시)
                    if (!tagFilter.isEmpty()) {
                        if (s.getTags() == null) return false;
                        boolean has = s.getTags().stream()
                                .anyMatch(t -> t != null && t.toLowerCase().equals(tagFilter));
                        if (!has) return false;
                    }

                    // 거리 필터 (lat,lng가 있으면 반경 체크)
                    if (lat != null && lng != null && s.getLat() != null && s.getLng() != null) {
                        double dist = distanceInMeters(lat, lng, s.getLat(), s.getLng());
                        return dist <= radiusM;
                    }

                    return true;
                })
                .map(s -> {
                    Double distMeters = null;
                    if (lat != null && lng != null && s.getLat() != null && s.getLng() != null) {
                        distMeters = distanceInMeters(lat, lng, s.getLat(), s.getLng());
                    }
                    String distStr = (distMeters != null) ? Math.round(distMeters) + "m" : null;

                    return new StoreSearchRes(
                            s.getId(),
                            s.getName(),
                            s.getImg(),
                            s.getRating(),
                            s.getPhone(),
                            s.getHours(),
                            s.getAddress(),
                            distStr,
                            s.getLikedCount(),
                            s.getTags(),
                            s.getLat(),
                            s.getLng(),
                            distMeters
                    );
                })
                .sorted((a, b) -> {
                    // 위치 있으면 거리순
                    if (a.distanceMeters() != null && b.distanceMeters() != null) {
                        return Double.compare(a.distanceMeters(), b.distanceMeters());
                    }
                    // 없으면 평점 내림차순
                    double r1 = a.rating() == null ? 0.0 : a.rating();
                    double r2 = b.rating() == null ? 0.0 : b.rating();
                    return Double.compare(r2, r1);
                })
                .limit(limit)
                .toList();
    }

    // ---------- 내 위치 기준 주변 가게 ----------
    // GET /api/stores/nearby?lat=37.56&lng=126.97&radiusM=2000&limit=20
    @GetMapping("/nearby")
    public ResponseEntity<List<StoreWithDistanceRes>> nearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2000") int radiusM,
            @RequestParam(defaultValue = "20") int limit
    ) {
        List<Store> all = storeRepo.findAll();

        List<StoreWithDistanceRes> result = all.stream()
                .filter(s -> s.getLat() != null && s.getLng() != null)
                .map(s -> {
                    double dist = distanceInMeters(lat, lng, s.getLat(), s.getLng());
                    return new StoreWithDistanceRes(s, dist);
                })
                .filter(s -> s.distanceMeters() <= radiusM)
                .sorted(Comparator.comparingDouble(StoreWithDistanceRes::distanceMeters))
                .limit(limit)
                .toList();

        return ResponseEntity.ok(result);
    }

    // Haversine 공식으로 두 좌표 간 거리(m) 계산
    private double distanceInMeters(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371000; // 지구 반지름 (m)
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // ---------- DTO들 ----------

    // 생성용
    public record CreateStoreReq(
            String name,
            String img,
            String phone,
            String hours,
            String address,
            Double lat,
            Double lng,
            List<String> tags
    ) {}

    // 수정용 (부분 수정 가능)
    public record UpdateStoreReq(
            String name,
            String img,
            String phone,
            String hours,
            String address,
            Double lat,
            Double lng,
            List<String> tags,
            Integer likedCount,
            Double rating,
            Integer ratingCount
    ) {}

    // nearby 응답용: 프론트 구조 + distance 문자열
    public record StoreWithDistanceRes(
            String id,
            String name,
            String img,
            Double rating,
            String phone,
            String hours,
            String address,
            String distance,        // "235m" 이런 식
            Integer likedCount,
            List<String> tags,
            Double lat,
            Double lng,
            double distanceMeters   // 필요하면 프론트에서 쓰라고 raw 값도 같이
    ) {
        public StoreWithDistanceRes(Store s, double distanceMeters) {
            this(
                    s.getId(),
                    s.getName(),
                    s.getImg(),
                    s.getRating(),
                    s.getPhone(),
                    s.getHours(),
                    s.getAddress(),
                    Math.round(distanceMeters) + "m",
                    s.getLikedCount(),
                    s.getTags(),
                    s.getLat(),
                    s.getLng(),
                    distanceMeters
            );
        }
    }

    // 검색 응답용 DTO
    public record StoreSearchRes(
            String id,
            String name,
            String img,
            Double rating,
            String phone,
            String hours,
            String address,
            String distance,      // "235m"
            Integer likedCount,
            List<String> tags,
            Double lat,
            Double lng,
            Double distanceMeters // 숫자 거리 (정렬/디버깅용)
    ) {}
}
