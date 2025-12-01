package app.deliciousfood.review;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {

    // 가게 기준 리뷰 (최신순)
    List<Review> findByStoreIdOrderByCreatedAtDesc(String storeId);

    // 유저 기준 리뷰 (최신순)
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
}
