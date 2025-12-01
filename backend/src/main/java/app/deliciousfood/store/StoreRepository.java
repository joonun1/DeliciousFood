package app.deliciousfood.store;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface StoreRepository extends MongoRepository<Store, String> {
    // 지금은 커스텀 쿼리 없음
}
