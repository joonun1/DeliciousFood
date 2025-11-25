package app.deliciousfood.menu;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MenuController {

    private final MenuRepository menuRepository;

    // ---------- 메뉴 생성 ----------
    // POST /api/stores/{storeId}/menus
    @PostMapping("/stores/{storeId}/menus")
    public ResponseEntity<Menu> createMenu(
            @PathVariable String storeId,
            @RequestBody CreateMenuReq req
    ) {
        Menu m = new Menu();
        m.setStoreId(storeId);
        m.setName(req.name());
        m.setPrice(req.price());
        m.setDescription(req.description());
        m.setImageUrl(req.imageUrl());
        m.setCreatedAt(Instant.now());
        m.setUpdatedAt(Instant.now());

        Menu saved = menuRepository.save(m);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // ---------- 특정 가게의 메뉴 목록 ----------
    // GET /api/stores/{storeId}/menus
    @GetMapping("/stores/{storeId}/menus")
    public List<Menu> listMenus(@PathVariable String storeId) {
        return menuRepository.findByStoreId(storeId);
    }

    // ---------- 메뉴 한 개 조회 ----------
    // GET /api/menus/{menuId}
    @GetMapping("/menus/{menuId}")
    public ResponseEntity<Menu> getMenu(@PathVariable String menuId) {
        Optional<Menu> opt = menuRepository.findById(menuId);
        return opt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------- 메뉴 수정 ----------
    // PUT /api/menus/{menuId}
    @PutMapping("/menus/{menuId}")
    public ResponseEntity<Menu> updateMenu(
            @PathVariable String menuId,
            @RequestBody UpdateMenuReq req
    ) {
        Optional<Menu> opt = menuRepository.findById(menuId);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Menu m = opt.get();
        if (req.name() != null) m.setName(req.name());
        if (req.price() != null) m.setPrice(req.price());
        if (req.description() != null) m.setDescription(req.description());
        if (req.imageUrl() != null) m.setImageUrl(req.imageUrl());
        m.setUpdatedAt(Instant.now());

        Menu saved = menuRepository.save(m);
        return ResponseEntity.ok(saved);
    }

    // ---------- 메뉴 삭제 ----------
    // DELETE /api/menus/{menuId}
    @DeleteMapping("/menus/{menuId}")
    public ResponseEntity<Void> deleteMenu(@PathVariable String menuId) {
        if (!menuRepository.existsById(menuId)) {
            return ResponseEntity.notFound().build();
        }
        menuRepository.deleteById(menuId);
        return ResponseEntity.noContent().build();
    }

    // ---------- DTO ----------
    public record CreateMenuReq(
            String name,
            BigDecimal price,
            String description,
            String imageUrl
    ) {}

    public record UpdateMenuReq(
            String name,
            BigDecimal price,
            String description,
            String imageUrl
    ) {}
}
