package app.deliciousfood.store;

import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StoreRepository extends MongoRepository<Store, String> {
    List<Store> findByLocationNear(Point point, Distance maxDistance, Pageable pageable);

    // (선택) 간단한 이름 검색
    List<Store> findByNameContainingIgnoreCase(String q);
}
