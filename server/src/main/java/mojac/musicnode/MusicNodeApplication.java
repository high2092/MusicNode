package mojac.musicnode;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class MusicNodeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MusicNodeApplication.class, args);
	}

	final static String CLIENT_URL = "http://localhost:3000";

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins(CLIENT_URL)
						.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE");
			}
		};
	}

}
