package mojac.musicnode.service;

import lombok.RequiredArgsConstructor;
import mojac.musicnode.domain.Category;
import mojac.musicnode.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public Long saveCategory(Category category) {
        categoryRepository.save(category);
        return category.getId();
    }

    public List<Category> findCategories() {
        return categoryRepository.findAll();
    }
}
