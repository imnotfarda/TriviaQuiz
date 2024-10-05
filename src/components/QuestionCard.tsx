import React from 'react';
import { AnswerObject } from '../App';

const ButtonWrapper: React.FC<{ correct: boolean; userClicked: boolean; children: React.ReactNode }> = ({
  correct,
  userClicked,
  children
}) => (
  <div
    className={`mb-3 p-2 
      first-letter:first-line:
      ${userClicked && !correct ? 'bg-red-400 border border-red-400' : ''}  
      ${correct ? 'bg-green-400 border border-green-400' : ''} 
      rounded-md shadow-md transition-all`}
  >
    {children}
  </div>
);

type Props = {
  question: string;
  answer: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNr: number;
  totalQuestions: number;
};

const QuestionCard: React.FC<Props> = ({
  question,
  answer,
  callback,
  userAnswer,
  questionNr,
  totalQuestions
}) => (
  <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg border border-gray-200">
    <p className="text-lg font-semibold mb-4">
      Question {questionNr} of {totalQuestions}
    </p>
    <p className="text-gray-800 mb-6" dangerouslySetInnerHTML={{ __html: question }} />
    <div className="space-y-3">
      {answer.map((ans) => (
        <ButtonWrapper
          key={ans}
          correct={userAnswer?.correctAnswer === ans}
          userClicked={userAnswer?.answer === ans} 
        >
          <button
          value={ans}  
            className={`w-full text-left p-3 rounded-md 
              ${userAnswer ? 'cursor-not-allowed' : 'hover:bg-gray-200'} 
              ${
                userAnswer && ans === userAnswer.correctAnswer ? 'bg-green-400' : 
                userAnswer && ans === userAnswer.answer && userAnswer.answer !== userAnswer.correctAnswer ? 'bg-red-400' : ''
              } 
              focus:outline-none`}
            disabled={!!userAnswer} 
            onClick={callback}
          >
            <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: ans }} />
          </button>
        </ButtonWrapper>
      ))}
    </div>
  </div>
);

export default QuestionCard;