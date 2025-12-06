package app.deliciousfood.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserRepository userRepository;

    // -------------------------------
    // 1) 전체 유저 조회
    // GET /api/users
    // -------------------------------
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // -------------------------------
    // 2) 특정 유저 조회
    // GET /api/users/{id}
    // -------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------
    // 3) 이메일로 조회
    // GET /api/users/email/{email}
    // -------------------------------
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------
    // 4) 유저 정보 일부 수정
    // PUT /api/users/{id}
    // -------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable String id,
            @RequestBody UserUpdateRequest req
    ) {
        return userRepository.findById(id)
                .map(user -> {

                    if (req.name() != null) user.setName(req.name());
                    if (req.nation() != null) user.setNation(req.nation());
                    if (req.language() != null) user.setLanguage(req.language());

                    // 비밀번호 필드는 인증컨트롤러에서 다루는 게 안전하므로 여기선 제외
                    user.setCreatedAt(user.getCreatedAt() == null ? Instant.now() : user.getCreatedAt());

                    userRepository.save(user);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------
    // 5) 유저 삭제
    // DELETE /api/users/{id}
    // -------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {

        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // DTO
    public record UserUpdateRequest(
            String name,
            String nation,
            String language
    ) {}
}
