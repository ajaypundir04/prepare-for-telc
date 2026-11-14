package com.preparefortelc.questionbank.application;

import com.preparefortelc.questionbank.application.dto.QuestionRequest;
import com.preparefortelc.questionbank.domain.ExamLevel;
import com.preparefortelc.questionbank.domain.ExamModule;
import com.preparefortelc.questionbank.domain.Question;
import com.preparefortelc.questionbank.domain.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuestionApplicationService {

    private final QuestionRepository questionRepository;

    public QuestionApplicationService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Transactional(readOnly = true)
    public List<Question> getQuestions(ExamLevel level, ExamModule module) {
        if (level != null && module != null) {
            return questionRepository.findByLevelAndModule(level, module);
        } else if (level != null) {
            return questionRepository.findByLevel(level);
        } else if (module != null) {
            return questionRepository.findByModule(module);
        }
        return questionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + id));
    }

    @Transactional
    public Question createQuestion(QuestionRequest req) {
        Question q = new Question();
        q.setTitle(req.getTitle());
        q.setPassage(req.getPassage());
        q.setQuestionText(req.getQuestionText());
        q.setLevel(req.getLevel());
        q.setModule(req.getModule());
        q.setAudioUrl(req.getAudioUrl());
        q.setMaxAudioPlays(req.getMaxAudioPlays() != null ? req.getMaxAudioPlays() : 2);
        q.setOptions(req.getOptions());
        q.setCorrectAnswer(req.getCorrectAnswer());
        q.setExplanation(req.getExplanation());
        q.setPoints(req.getPoints() != null ? req.getPoints() : 5);
        return questionRepository.save(q);
    }

    @Transactional
    public Question updateQuestion(Long id, QuestionRequest req) {
        Question q = getQuestionById(id);
        q.setTitle(req.getTitle());
        q.setPassage(req.getPassage());
        q.setQuestionText(req.getQuestionText());
        q.setLevel(req.getLevel());
        q.setModule(req.getModule());
        q.setAudioUrl(req.getAudioUrl());
        q.setMaxAudioPlays(req.getMaxAudioPlays() != null ? req.getMaxAudioPlays() : 2);
        q.setOptions(req.getOptions());
        q.setCorrectAnswer(req.getCorrectAnswer());
        q.setExplanation(req.getExplanation());
        q.setPoints(req.getPoints() != null ? req.getPoints() : 5);
        return questionRepository.save(q);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new IllegalArgumentException("Question not found with id: " + id);
        }
        questionRepository.deleteById(id);
    }
}
