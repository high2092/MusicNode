package mojac.musicnode.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class MusicNodeRepositoryTest {

    @Autowired MusicNodeRepository musicNodeRepository;

    @Test
    public void 노드_조회() {
        musicNodeRepository.findAll();
        System.out.println("musicNodeRepository.findAll() = " + musicNodeRepository.findAll());
    }
}
