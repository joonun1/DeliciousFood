package app.DeliciousFood.store;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface StoreRepository extends JpaRepository<Store, UUID> {

    // 반경(m) 이내를 거리순으로
    @Query(value = """
        SELECT * FROM stores
        WHERE ST_DWithin(geom, ST_MakePoint(:lng, :lat)::geography, :radiusM)
        ORDER BY ST_DistanceSphere(geom, ST_MakePoint(:lng, :lat))
        LIMIT :limit
        """, nativeQuery = true)
    List<Store> findNearby(double lat, double lng, int radiusM, int limit);
}
