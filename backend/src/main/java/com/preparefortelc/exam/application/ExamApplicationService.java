package com.preparefortelc.exam.application;

import com.preparefortelc.exam.application.dto.ExamRequest;
import com.preparefortelc.exam.domain.Exam;
import com.preparefortelc.exam.domain.ExamRepository;
import com.preparefortelc.questionbank.domain.ExamLevel;
import com.preparefortelc.questionbank.domain.Question;
import com.preparefortelc.questionbank.domain.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExamApplicationService {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    public ExamApplicationService(ExamRepository examRepository, QuestionRepository questionRepository) {
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
    }

    @Transactional(readOnly = true)
    public List<Exam> getExams(ExamLevel level) {
        if (level != null) {
            return examRepository.findByLevel(level);
        }
        return examRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found with id: " + id));
    }

    @Transactional
    public Exam createExam(ExamRequest req) {
        Exam exam = new Exam();
        exam.setTitle(req.getTitle());
        exam.setDescription(req.getDescription());
        exam.setLevel(req.getLevel());
        if (req.getDurationMinutes() != null) {
            exam.setDurationMinutes(req.getDurationMinutes());
        }
        if (req.getPassingPercentage() != null) {
            exam.setPassingPercentage(req.getPassingPercentage());
        }

        List<Question> questions = new ArrayList<>();
        if (req.getQuestionIds() != null) {
            for (Long qId : req.getQuestionIds()) {
                questionRepository.findById(qId).ifPresent(questions::add);
            }
        }
        exam.setQuestions(questions);

        return examRepository.save(exam);
    }
}
