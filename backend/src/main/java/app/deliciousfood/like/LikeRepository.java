package app.deliciousfood.like;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LikeRepository extends MongoRepository<Like, String> {

    boolean existsByUserIdAndStoreId(String userId, String storeId);

    void deleteByUserIdAndStoreId(String userId, String storeId);

    List<Like> findByUserId(String userId);

    long countByStoreId(String storeId);
}
