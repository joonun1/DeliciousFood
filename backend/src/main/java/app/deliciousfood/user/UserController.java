package app.deliciousfood.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequest req) {
        // 정규화
        final String email = req.email() == null ? "" : req.email().trim().toLowerCase();
        final String name  = req.name()  == null ? "" : req.name().trim();
        final String rawPw = req.password() == null ? "" : req.password().trim();

        log.info("register called email={}, name={}", email, name);

        if (email.isEmpty() || rawPw.isEmpty() || name.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        User u = new User();
        u.setEmail(email);
        u.setName(name);
        u.setPasswordHash(passwordEncoder.encode(rawPw));
        u.setCreatedAt(java.time.Instant.now()); // Mongo가 다루기 쉬운 타입 권장

        userRepository.save(u);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SimpleMessage("registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest req) {
        // 정규화
        final String email = req.email() == null ? "" : req.email().trim().toLowerCase();
        final String rawPw = req.password() == null ? "" : req.password().trim();

        log.info("login called email={}", email);

        return userRepository.findByEmail(email)
                .map(u -> {
                    String hash = u.getPasswordHash();
                    boolean ok = (hash != null) && passwordEncoder.matches(rawPw, hash);
                    if (!ok) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
                    }
                    return ResponseEntity.ok(new SimpleMessage("login ok"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));
    }


    @PostMapping("/nation")
    public ResponseEntity<?> setNation(@RequestBody NationRequest req) {
        log.info("setNation email={}, nation={}", req.email(), req.nation());
        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));
        user.setNation(req.nation());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("국가가 저장 되었습니다.", true));
    }

    @PostMapping("/language")
    public ResponseEntity<?> setLanguage(@RequestBody LanguageRequest req) {
        log.info("setLanguage email={}, language={}", req.email(), req.language());
        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));
        user.setLanguage(req.language());
        userRepository.save(user);
        return ResponseEntity.ok(new ProfileResult(true, "language saved", user.getEmail(), user.getNation(), user.getLanguage()));
    }

    /** 옵션: nation, language를 한 번에 업데이트하고 싶을 때 */
    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileRequest req) {
        log.info("updateProfile email={}, nation={}, language={}", req.email(), req.nation(), req.language());
        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));
        if (req.nation() != null && !req.nation().isBlank()) user.setNation(req.nation());
        if (req.language() != null && !req.language().isBlank()) user.setLanguage(req.language());
        userRepository.save(user);
        return ResponseEntity.ok(new ProfileResult(true, "profile saved", user.getEmail(), user.getNation(), user.getLanguage()));
    }

    // DTOs
    public record UserRegisterRequest(String email, String password, String name) {}
    public record UserLoginRequest(String email, String password) {}
    public record SimpleMessage(String message) {}
    public record NationRequest(String email, String nation) {}
    public record LanguageRequest(String email, String language) {}
    public record ProfileRequest(String email, String nation, String language) {}
    public record ProfileResult(boolean success, String message, String email, String nation, String language) {}
}
