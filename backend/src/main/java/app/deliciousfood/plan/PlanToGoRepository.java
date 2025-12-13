package app.deliciousfood.plan;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PlanToGoRepository extends MongoRepository<PlanToGo, String> {

    List<PlanToGo> findByUserId(String userId);
}
