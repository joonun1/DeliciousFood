package app.DeliciousFood.api;

import app.DeliciousFood.store.Store;
import app.DeliciousFood.store.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreRepository repo;
    private final GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);

    public record CreateStoreReq(String name, String address, String description, double lat, double lng) {}

    @PostMapping
    public Store create(@RequestBody CreateStoreReq req) {
        Point p = gf.createPoint(new Coordinate(req.lng(), req.lat()));
        Store s = new Store();
        s.setName(req.name());
        s.setAddress(req.address());
        s.setDescription(req.description());
        s.setLocation(p);
        return repo.save(s);
    }

    @GetMapping("/nearby")
    public List<Store> nearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2000") int radiusM,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return repo.findNearby(lat, lng, radiusM, limit);
    }
}
