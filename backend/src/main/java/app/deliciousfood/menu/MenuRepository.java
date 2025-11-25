package app.deliciousfood.menu;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MenuRepository extends MongoRepository<Menu, String> {

    // 특정 가게 메뉴들
    List<Menu> findByStoreId(String storeId);
}
