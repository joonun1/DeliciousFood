package com.delicious.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 실제 경로: 프로젝트 루트 기준 ../frontend/
        String frontendPath = Paths.get("../../frontend").toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/**")
                .addResourceLocations("file:" + frontendPath);
    }
}
