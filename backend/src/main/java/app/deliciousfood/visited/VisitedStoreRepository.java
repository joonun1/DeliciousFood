package app.deliciousfood.visited;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VisitedStoreRepository extends MongoRepository<VisitedStore, String> {

    List<VisitedStore> findByUserId(String userId);
}
