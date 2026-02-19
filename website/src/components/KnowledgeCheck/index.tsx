import React, { useState } from 'react';
import styles from './KnowledgeCheck.module.css';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sectionRef?: string;
  sectionLabel?: string;
}

interface KnowledgeCheckProps {
  questions: Question[];
  chapterTitle?: string;
}

type AnswerMap = Record<number, number>;

export default function KnowledgeCheck({
  questions,
  chapterTitle,
}: KnowledgeCheckProps): JSX.Element {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      return;
    }
    setSubmitted(true);
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
  };

  const score = submitted
    ? questions.filter(q => answers[q.id] === q.correctIndex).length
    : 0;

  const allAnswered = Object.keys(answers).length === questions.length;
  const missedQuestions = submitted
    ? questions.filter(q => answers[q.id] !== q.correctIndex)
    : [];

  const scorePercent = submitted ? Math.round((score / questions.length) * 100) : 0;
  const scoreClass =
    scorePercent >= 80
      ? styles.scorePass
      : scorePercent >= 60
      ? styles.scorePartial
      : styles.scoreFail;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>Knowledge Check</span>
        {chapterTitle && (
          <span className={styles.chapterTitle}>{chapterTitle}</span>
        )}
      </div>

      <div className={styles.questions}>
        {questions.map((q, idx) => {
          const selected = answers[q.id];
          const isCorrect = submitted && selected === q.correctIndex;
          const isWrong = submitted && selected !== undefined && selected !== q.correctIndex;

          return (
            <div
              key={q.id}
              className={`${styles.question} ${
                submitted
                  ? isCorrect
                    ? styles.questionCorrect
                    : isWrong
                    ? styles.questionWrong
                    : styles.questionUnanswered
                  : ''
              }`}
            >
              <p className={styles.questionText}>
                <span className={styles.questionNumber}>{idx + 1}.</span>{' '}
                {q.question}
              </p>

              <div className={styles.options}>
                {q.options.map((option, optIdx) => {
                  const isSelected = selected === optIdx;
                  const isCorrectOption = optIdx === q.correctIndex;
                  let optionClass = styles.option;

                  if (submitted) {
                    if (isCorrectOption) optionClass = `${styles.option} ${styles.optionCorrect}`;
                    else if (isSelected && !isCorrectOption) optionClass = `${styles.option} ${styles.optionWrong}`;
                  } else if (isSelected) {
                    optionClass = `${styles.option} ${styles.optionSelected}`;
                  }

                  return (
                    <label key={optIdx} className={optionClass}>
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={optIdx}
                        checked={isSelected}
                        onChange={() => handleSelect(q.id, optIdx)}
                        disabled={submitted}
                        className={styles.radio}
                      />
                      <span className={styles.optionMarker}>
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className={styles.optionText}>{option}</span>
                      {submitted && isCorrectOption && (
                        <span className={styles.correctMark}>✓</span>
                      )}
                      {submitted && isSelected && !isCorrectOption && (
                        <span className={styles.wrongMark}>✗</span>
                      )}
                    </label>
                  );
                })}
              </div>

              {submitted && (
                <div
                  className={`${styles.feedback} ${
                    isCorrect ? styles.feedbackCorrect : styles.feedbackWrong
                  }`}
                >
                  <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong>{' '}
                  {q.explanation}
                  {!isCorrect && q.sectionRef && (
                    <span className={styles.reviewLink}>
                      {' '}
                      <a href={q.sectionRef}>
                        Review: {q.sectionLabel || 'relevant section'} →
                      </a>
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <div className={styles.submitArea}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!allAnswered}
            title={!allAnswered ? 'Answer all questions before submitting' : ''}
          >
            Submit Answers
          </button>
          {!allAnswered && (
            <span className={styles.hint}>
              {Object.keys(answers).length}/{questions.length} answered
            </span>
          )}
        </div>
      ) : (
        <div className={styles.results}>
          <div className={`${styles.score} ${scoreClass}`}>
            <span className={styles.scoreValue}>
              {score}/{questions.length}
            </span>
            <span className={styles.scoreLabel}>
              {scorePercent}% — {
                scorePercent >= 80
                  ? 'Excellent work!'
                  : scorePercent >= 60
                  ? 'Good effort — review the missed topics below.'
                  : 'Keep studying — re-read the chapter sections linked below.'
              }
            </span>
          </div>

          {missedQuestions.length > 0 && (
            <div className={styles.reviewSection}>
              <p className={styles.reviewTitle}>Topics to review:</p>
              <ul className={styles.reviewList}>
                {missedQuestions.map(q =>
                  q.sectionRef ? (
                    <li key={q.id}>
                      <a href={q.sectionRef}>{q.sectionLabel || q.question}</a>
                    </li>
                  ) : null
                ).filter(Boolean)}
              </ul>
            </div>
          )}

          <button className={styles.resetBtn} onClick={handleReset}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
