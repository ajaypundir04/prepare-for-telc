package com.preparefortelc.shared.config;

import com.preparefortelc.assignment.domain.AssignmentStatus;
import com.preparefortelc.assignment.domain.ExamAssignment;
import com.preparefortelc.assignment.domain.ExamAssignmentRepository;
import com.preparefortelc.exam.domain.Exam;
import com.preparefortelc.exam.domain.ExamRepository;
import com.preparefortelc.identity.domain.Role;
import com.preparefortelc.identity.domain.User;
import com.preparefortelc.identity.domain.UserRepository;
import com.preparefortelc.questionbank.domain.ExamLevel;
import com.preparefortelc.questionbank.domain.ExamModule;
import com.preparefortelc.questionbank.domain.Question;
import com.preparefortelc.questionbank.domain.QuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;
    private final ExamAssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           QuestionRepository questionRepository,
                           ExamRepository examRepository,
                           ExamAssignmentRepository assignmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.examRepository = examRepository;
        this.assignmentRepository = assignmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized. Skipping seed.");
            return;
        }

        log.info("Initializing TELC Exam Preparation mock database (DDD structure)...");

        // 1. Seed Users
        User teacher = new User("teacher@telc.com", passwordEncoder.encode("Password123!"), "Dr. Maria Schmidt (Teacher)", Role.ROLE_TEACHER);
        User student = new User("student@telc.com", passwordEncoder.encode("Password123!"), "Alex Mustermann (Student)", Role.ROLE_STUDENT);
        User admin = new User("admin@telc.com", passwordEncoder.encode("Password123!"), "Admin TELC Platform", Role.ROLE_ADMIN);

        userRepository.save(teacher);
        userRepository.save(student);
        userRepository.save(admin);
        log.info("Seeded users: teacher@telc.com, student@telc.com, admin@telc.com (Password: Password123!)");

        // 2. Seed Questions
        List<Question> questions = new ArrayList<>();

        // Lesen Question 1
        Question qLesen1 = new Question();
        qLesen1.setTitle("Leseverstehen Teil 1: Flexible Arbeitszeiten im modernen Büro");
        qLesen1.setLevel(ExamLevel.B2);
        qLesen1.setModule(ExamModule.LESEN);
        qLesen1.setPassage(
                "Die Digitalisierung hat in den letzten Jahren die deutsche Arbeitswelt grundlegend verändert. " +
                "Immer mehr Betriebe ermöglichen ihren Beschäftigten Vertrauensarbeitszeit und hybride Arbeitsmodelle. " +
                "Studien belegen, dass eine hohe Autonomie am Arbeitsplatz die Produktivität und Zufriedenheit steigert, " +
                "sofern klare Kommunikationsrichtlinien eingehalten werden. Allerdings klagen manche Angestellte über " +
                "eine Verwischung der Grenzen zwischen Beruf und Freizeit."
        );
        qLesen1.setQuestionText("Welche wesentliche Auswirkung von flexiblen Arbeitsmodellen wird im Text hervorgehoben?");
        qLesen1.setOptions(Arrays.asList(
                "A) Sie führen ausnahmslos zu sinkender Mitarbeiterzufriedenheit.",
                "B) Sie erhöhen nachweislich Produktivität und Zufriedenheit bei klaren Kommunikationsregeln.",
                "C) Sie verringern die Autonomie am Arbeitsplatz drastisch.",
                "D) Sie werden von den meisten Betrieben in Deutschland abgelehnt."
        ));
        qLesen1.setCorrectAnswer("B");
        qLesen1.setExplanation("Der Text nennt ausdrücklich: 'Studien belegen, dass eine hohe Autonomie am Arbeitsplatz die Produktivität und Zufriedenheit steigert, sofern klare Kommunikationsrichtlinien eingehalten werden.'");
        qLesen1.setPoints(10);
        questions.add(qLesen1);

        // Lesen Question 2
        Question qLesen2 = new Question();
        qLesen2.setTitle("Leseverstehen Teil 2: Lebenslanges Lernen in Europa");
        qLesen2.setLevel(ExamLevel.B2);
        qLesen2.setModule(ExamModule.LESEN);
        qLesen2.setPassage(
                "In Zeiten schneller technischer Entwicklungen gewinnt lebenslanges Lernen immer größere Relevanz. " +
                "Arbeitnehmer, die sich regelmäßig weiterbilden, sichern ihre Beschäftigungsfähigkeit und öffnen sich " +
                "neue Aufstiegschancen. Staatliche Förderprogramme wie Bildungsgutscheine unterstützen dabei auch Personen, " +
                "die sich beruflich komplett umorientieren möchten."
        );
        qLesen2.setQuestionText("Wozu dienen laut Abschnitt die staatlichen Bildungsgutscheine?");
        qLesen2.setOptions(Arrays.asList(
                "A) Ausschließlich zur Finanzierung von universitären Master-Studiengängen.",
                "B) Zur finanziellen Unterstützung von Personen auch bei beruflicher Neuorientierung.",
                "C) Zum Ersatz des regulären Gehaltes während unbezahltem Urlaub.",
                "D) Zum Erwerb von technischem Büroequipment."
        ));
        qLesen2.setCorrectAnswer("B");
        qLesen2.setExplanation("Laut Text unterstützen staatliche Förderprogramme wie Bildungsgutscheine auch Personen, die sich beruflich komplett umorientieren möchten.");
        qLesen2.setPoints(10);
        questions.add(qLesen2);

        // Sprachbausteine Question 1
        Question qSb1 = new Question();
        qSb1.setTitle("Sprachbausteine Teil 1: Bewerbungsschreiben (Präpositionen)");
        qSb1.setLevel(ExamLevel.B2);
        qSb1.setModule(ExamModule.SPRACHBAUSTEINE);
        qSb1.setPassage(
                "Sehr geehrte Frau Dr. Weber,\n" +
                "[1] Bezug auf Ihr Stellenangebot vom 12. Mai in der Tageszeitung möchte ich mich hiermit um die Position als Projektkoordinator bewerben..."
        );
        qSb1.setQuestionText("Welche Präposition passt in Lücke [1]?");
        qSb1.setOptions(Arrays.asList(
                "A) In",
                "B) An",
                "C) Mit",
                "D) Bei"
        ));
        qSb1.setCorrectAnswer("A");
        qSb1.setExplanation("Die feste Wendung lautet: 'In Bezug auf (+ Akk.)'.");
        qSb1.setPoints(5);
        questions.add(qSb1);

        // Sprachbausteine Question 2
        Question qSb2 = new Question();
        qSb2.setTitle("Sprachbausteine Teil 1: Bewerbungsschreiben (Verbindung Verben)");
        qSb2.setLevel(ExamLevel.B2);
        qSb2.setModule(ExamModule.SPRACHBAUSTEINE);
        qSb2.setPassage(
                "...Aufgrund meiner mehrjährigen Erfahrung im Bereich Qualitätsmanagement bin ich davon überzeugt, den Anforderungen Ihrer Ausschreibung voll und ganz zu [2]..."
        );
        qSb2.setQuestionText("Welches Verb ergänzt den Ausdruck [2] 'den Anforderungen ...'?");
        qSb2.setOptions(Arrays.asList(
                "A) entsprechen",
                "B) erreichen",
                "C) genügen",
                "D) passen"
        ));
        qSb2.setCorrectAnswer("A");
        qSb2.setExplanation("Das Idiom lautet: 'den Anforderungen (voll und ganz) entsprechen' (Dativ).");
        qSb2.setPoints(5);
        questions.add(qSb2);

        // Sprachbausteine Question 3
        Question qSb3 = new Question();
        qSb3.setTitle("Sprachbausteine Teil 2: Feste Nomen-Verb-Verbindungen");
        qSb3.setLevel(ExamLevel.B2);
        qSb3.setModule(ExamModule.SPRACHBAUSTEINE);
        qSb3.setPassage("Geschäftlicher Schriftverkehr: Die Unternehmensleitung will im kommenden Quartal eine weitreichende Maßnahme ...");
        qSb3.setQuestionText("Welches Verb bildet mit dem Nomen 'eine Entscheidung' bzw. 'Maßnahmen' eine korrekte Kollokation ('Maßnahmen ...')?");
        qSb3.setOptions(Arrays.asList(
                "A) machen",
                "B) ergreifen",
                "C) tun",
                "D) stellen"
        ));
        qSb3.setCorrectAnswer("B");
        qSb3.setExplanation("Die korrekte gehobene Nomen-Verb-Verbindung lautet: 'Maßnahmen ergreifen'.");
        qSb3.setPoints(5);
        questions.add(qSb3);

        // Hören Question 1 (Listening Comprehension with Audio URL)
        Question qHoeren1 = new Question();
        qHoeren1.setTitle("Hörverstehen Teil 1: Radio-Feature über Erneuerbare Energien");
        qHoeren1.setLevel(ExamLevel.B2);
        qHoeren1.setModule(ExamModule.HOEREN);
        qHoeren1.setAudioUrl("https://actions.google.com/sounds/v1/ambiences/outdoor_market.ogg");
        qHoeren1.setMaxAudioPlays(2);
        qHoeren1.setPassage("Hören Sie den Bericht zur Energiewende in Süddeutschland. Sie hören den Beitrag zweimal.");
        qHoeren1.setQuestionText("Welche Herausforderung nennen die Experten als zentral für den Ausbau des Stromnetzes?");
        qHoeren1.setOptions(Arrays.asList(
                "A) Ein Mangel an geeigneten Speichertechnologien für Spitzenzeiten.",
                "B) Fehlendes Interesse der Bevölkerung am Klimaschutz.",
                "C) Zu niedrige Kosten für fossile Brennstoffe.",
                "D) Überflüssige Kapazitäten bei Windkraftanlagen im Norden."
        ));
        qHoeren1.setCorrectAnswer("A");
        qHoeren1.setExplanation("In der Audioberichterstattung betont der Ingenieur: 'Der Hauptengpass liegt derzeit in der Entwicklung skalierbarer Energiespeicher.'");
        qHoeren1.setPoints(10);
        questions.add(qHoeren1);

        // Hören Question 2 (Listening Comprehension with Audio URL)
        Question qHoeren2 = new Question();
        qHoeren2.setTitle("Hörverstehen Teil 2: Interview mit einer HR-Managerin");
        qHoeren2.setLevel(ExamLevel.B2);
        qHoeren2.setModule(ExamModule.HOEREN);
        qHoeren2.setAudioUrl("https://actions.google.com/sounds/v1/office/typing_on_laptop.ogg");
        qHoeren2.setMaxAudioPlays(2);
        qHoeren2.setPassage("Hören Sie das Interview über interkulturelle Teams am Arbeitsplatz. Sie hören das Gespräch zweimal.");
        qHoeren2.setQuestionText("Was empfiehlt Frau Dr. Klein neuen Mitarbeitenden in internationalen Firmen?");
        qHoeren2.setOptions(Arrays.asList(
                "A) Kulturelle Unterschiede im Team komplett zu ignorieren.",
                "B) Regelmäßige Feedback-Gespräche aktiv einzufordern und offen zu kommunizieren.",
                "C) Keine Fragen während Teambesprechungen zu stellen.",
                "D) Nur in der eigenen Muttersprache zu korrespondieren."
        ));
        qHoeren2.setCorrectAnswer("B");
        qHoeren2.setExplanation("Frau Dr. Klein rät eindringlich: 'Offene Kommunikation und aktives Einholen von Feedback verhindern Missverständnisse.'");
        qHoeren2.setPoints(10);
        questions.add(qHoeren2);

        List<Question> savedQuestions = questionRepository.saveAll(questions);
        log.info("Seeded {} TELC B2 questions across Lesen, Sprachbausteine, Hören", savedQuestions.size());

        // 3. Seed Exam Template
        Exam exam = new Exam();
        exam.setTitle("TELC Deutsch B2 - Offizieller Modelltest 1");
        exam.setDescription("Offizieller TELC B2 Vorbereitungstest umfassend Leseverstehen, Sprachbausteine und Hörverstehen mit Audio-Wiedergabebeschränkung (max. 2x). Bestehensgrenze: 60%.");
        exam.setLevel(ExamLevel.B2);
        exam.setDurationMinutes(90);
        exam.setPassingPercentage(60.0);
        exam.setQuestions(savedQuestions);

        Exam savedExam = examRepository.save(exam);
        log.info("Seeded Exam: {} (ID: {})", savedExam.getTitle(), savedExam.getId());

        // 4. Seed Exam Assignment for Alex Mustermann (Student)
        ExamAssignment assignment = new ExamAssignment();
        assignment.setStudent(student);
        assignment.setExam(savedExam);
        assignment.setAssignedBy(teacher);
        assignment.setAssignedAt(Instant.now());
        assignment.setExpiresAt(Instant.now().plus(14, ChronoUnit.DAYS));
        assignment.setStatus(AssignmentStatus.PENDING);

        ExamAssignment savedAssignment = assignmentRepository.save(assignment);
        log.info("Dispatched initial exam assignment ID: {} to student@telc.com", savedAssignment.getId());
    }
}
