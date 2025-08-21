package app.deliciousfood.store;

import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StoreRepository extends MongoRepository<Store, String> {
    // Mongo의 near 쿼리 (2dsphere 인덱스 필요)
    List<Store> findByLocationNear(Point point, Distance maxDistance, Pageable pageable);
}
