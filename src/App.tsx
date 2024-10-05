import { useEffect, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { Difficulty, fetchQuizQuestions, QuestionState } from "./API";
import '../src/index.css';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver && !userAnswers[number]) {
      const answer = e.currentTarget.value;
      const correctAnswer = questions[number].correct_answer;
      const correct = correctAnswer.toLowerCase() === answer.toLowerCase();

      if (correct) {
        setScore((prev) => prev + 1);
      }

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: correctAnswer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-wider">TRIVIA QUIZ</h1>
      
      {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && (
        <button 
          className="start bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-all mb-6" 
          onClick={startTrivia}
        >
          Start
        </button>
      )}

      {(gameOver && userAnswers.length === TOTAL_QUESTIONS) && (
        <p className="text-lg font-medium text-gray-700 mb-4">
          Game is over! Your score is: {score} out of {TOTAL_QUESTIONS}
        </p>
      )}

      {!gameOver && (
        <p className="score text-lg font-medium text-gray-700 mb-4">
          Score: {score}
        </p>
      )}

      {loading && <p className="text-gray-500 mb-4">Loading Questions...</p>}

      {!loading && !gameOver && (
        <QuestionCard
          questionNr={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answer={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}

      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 && (
        <button 
          className="next bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-400 transition-all mt-6" 
          onClick={nextQuestion}
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default App;
