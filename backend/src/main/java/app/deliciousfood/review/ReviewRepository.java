package app.deliciousfood.review;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByStoreIdOrderByCreatedAtDesc(UUID storeId);
}
