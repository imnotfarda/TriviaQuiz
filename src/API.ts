import { shuffleArray } from "./utils";

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export type QuestionState = Question & { answers: string[] };

const fetchQuizQuestions = async (
  amount: number, 
  difficulty: Difficulty
    ): Promise<QuestionState[]> => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        if (response.status === 429) {
          console.log("Too many requests. Retrying after a delay...");
          await new Promise((resolve) => setTimeout(resolve, 10000)); // Delay 10 seconds
          return fetchQuizQuestions(amount, difficulty); // Retry
        }
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data.results.map((question: Question) => ({
        ...question,
        answers: shuffleArray([
          ...question.incorrect_answers,
          question.correct_answer,
        ]),
      }));
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      return [];
    }
  };

export { fetchQuizQuestions };

