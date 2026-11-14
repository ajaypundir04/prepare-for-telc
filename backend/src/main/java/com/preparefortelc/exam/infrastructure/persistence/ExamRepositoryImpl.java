package com.preparefortelc.exam.infrastructure.persistence;

import com.preparefortelc.exam.domain.Exam;
import com.preparefortelc.exam.domain.ExamRepository;
import com.preparefortelc.questionbank.domain.ExamLevel;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ExamRepositoryImpl implements ExamRepository {

    private final JpaExamRepository jpaRepository;

    public ExamRepositoryImpl(JpaExamRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Exam save(Exam exam) {
        return jpaRepository.save(exam);
    }

    @Override
    public Optional<Exam> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Exam> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public List<Exam> findByLevel(ExamLevel level) {
        return jpaRepository.findByLevel(level);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }
}
