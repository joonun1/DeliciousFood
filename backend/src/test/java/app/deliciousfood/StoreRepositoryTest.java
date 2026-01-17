package app.deliciousfood;

import app.deliciousfood.store.Store;
import app.deliciousfood.store.StoreRepository;
import org.junit.jupiter.api.Test;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@SpringBootTest
public class StoreRepositoryTest {

    @Autowired
    private StoreRepository storeRepository;

    @Test
    void insertTestStore() {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point location = geometryFactory.createPoint(new Coordinate(126.9780, 37.5665)); // 서울

        Store store = new Store();
        store.setId(UUID.randomUUID());
        store.setName("JUnit 테스트 가게");
        store.setAddress("서울특별시 종로구");
        store.setDescription("JUnit 테스트 설명");
        store.setRatingAvg(BigDecimal.valueOf(4.7));
        store.setRatingCount(5);
        store.setLocation(location);
        store.setCreatedAt(OffsetDateTime.now());

        storeRepository.save(store);

        System.out.println("테스트 데이터 저장 완료!");
    }
}
