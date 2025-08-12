package app.deliciousfood.test;

import app.deliciousfood.store.Store;
import app.deliciousfood.store.StoreRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Component
public class DBTest implements CommandLineRunner{
    private final StoreRepository storeRepository;

    public DBTest(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Override
    public void run(String... args) {
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point location = geometryFactory.createPoint(new Coordinate(126.9780, 37.5665)); // 서울 좌표

        Store store = new Store();
        //store.setId(UUID.randomUUID());
        store.setName("Main 실행 테스트 가게");
        store.setAddress("서울특별시 종로구");
        store.setDescription("Main에서 저장한 테스트 데이터");
        store.setRatingAvg(BigDecimal.valueOf(4.9));
        store.setRatingCount(3);
        store.setLocation(location);
        store.setCreatedAt(OffsetDateTime.now());

        storeRepository.save(store);
        System.out.println("✅ Main에서 테스트 데이터 저장 완료!");
    }
}
