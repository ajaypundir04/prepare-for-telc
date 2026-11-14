package com.preparefortelc.questionbank.infrastructure.persistence;

import com.preparefortelc.questionbank.domain.ExamLevel;
import com.preparefortelc.questionbank.domain.ExamModule;
import com.preparefortelc.questionbank.domain.Question;
import com.preparefortelc.questionbank.domain.QuestionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class QuestionRepositoryImpl implements QuestionRepository {

    private final JpaQuestionRepository jpaRepository;

    public QuestionRepositoryImpl(JpaQuestionRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Question save(Question question) {
        return jpaRepository.save(question);
    }

    @Override
    public List<Question> saveAll(Iterable<Question> questions) {
        return jpaRepository.saveAll(questions);
    }

    @Override
    public Optional<Question> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Question> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public List<Question> findByLevel(ExamLevel level) {
        return jpaRepository.findByLevel(level);
    }

    @Override
    public List<Question> findByModule(ExamModule module) {
        return jpaRepository.findByModule(module);
    }

    @Override
    public List<Question> findByLevelAndModule(ExamLevel level, ExamModule module) {
        return jpaRepository.findByLevelAndModule(level, module);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }
}
