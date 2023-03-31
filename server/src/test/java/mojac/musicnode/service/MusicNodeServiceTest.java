package mojac.musicnode.service;

import mojac.musicnode.domain.Category;
import mojac.musicnode.domain.Music;
import mojac.musicnode.domain.MusicNode;
import mojac.musicnode.repository.CategoryRepository;
import mojac.musicnode.repository.MusicNodeRepository;
import mojac.musicnode.repository.MusicRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class MusicNodeServiceTest {

    @Autowired CategoryService categoryService;
    @Autowired MusicService musicService;
    @Autowired MusicNodeService musicNodeService;

    @Test
    @Rollback(false)
    public void 뮤직_노드_생성_통합_테스트() {
        // g
        Music music = new Music("아아", "12312");

        Category category = new Category("카테고리1", "#000000");
        music.addCategory(category);

        musicService.saveMusic(music);
        categoryService.saveCategory(category);

        // w
        MusicNode musicNode = new MusicNode(music);
        Long savedId = musicNodeService.saveMusicNode(musicNode);

        // t
        MusicNode foundNode = musicNodeService.findOne(savedId);

        assertThat(foundNode.getMusic().getCategories().size()).isEqualTo(1);
        assertThat(foundNode.getMusic()).isEqualTo(music);
    }

}