package app.deliciousfood.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        User u = new User();
        u.setEmail(req.email());
        u.setName(req.name());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setCreatedAt(OffsetDateTime.now());
        userRepository.save(u);

        return ResponseEntity.status(HttpStatus.CREATED).body(new SimpleMessage("registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest req) {
        return userRepository.findByEmail(req.email())
                .map(u -> {
                    String hash = u.getPasswordHash();
                    if (hash == null || !passwordEncoder.matches(req.password(), hash)) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
                    }
                    return ResponseEntity.ok(new SimpleMessage("login ok"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));
    }

    @PostMapping("/nation")
    public ResponseEntity<?> setNation(@RequestBody NationRequest req) {
        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));
        user.setNation(req.nation());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("국가가 저장 되었습니다.", true));
    }

    // DTOs
    public record UserRegisterRequest(String email, String password, String name) {}
    public record UserLoginRequest(String email, String password) {}
    public record SimpleMessage(String message) {}
    public record NationRequest(String email, String nation) {}
}
