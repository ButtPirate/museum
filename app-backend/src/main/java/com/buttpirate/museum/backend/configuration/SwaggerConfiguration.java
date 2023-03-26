package com.buttpirate.museum.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;

@Configuration
@EnableSwagger2
public class SwaggerConfiguration {
    @Bean
    public Docket productApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.buttpirate.museum.backend"))
                .paths(PathSelectors.regex("/(api|stub).*"))
                .build()
                .apiInfo(apiInfo());
    }

    protected String apiTitle() {
        return "Museum backend app API";
    };

    protected ApiInfo apiInfo() {
        return new ApiInfo(
                apiTitle(),
                null,
                "1.0",
                null,
                new Contact("Butt Pirate", "https://github.com/buttpirate", "buttpirate@tutanota.com"),
                null,
                null,
                Collections.emptyList()
        );
    }

    protected String name() {
        return "Museum App";
    }

}
