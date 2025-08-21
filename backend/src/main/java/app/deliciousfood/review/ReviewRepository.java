// ReviewRepository
package app.deliciousfood.review;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByStoreIdOrderByCreatedAtDesc(String storeId);
}
