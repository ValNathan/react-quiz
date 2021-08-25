import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fetchQuizQuestions } from "./API";

//Components
import QuestionCard from "./components/QuestionCard";

//Types
import { QuestionState, Difficulty } from "./API";

//Styles
import { GlobalStyle, Wrapper } from "./App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

//const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [newGame, setNewGame] = useState(true);
  const [difficulty, setDifficulty] = useState({
    value: Difficulty.EASY,
    label: "Easy",
  });
  const [totalQuestions, setTotalQuestions] = useState({
    value: 10,
    label: "10",
  });

  const startTrivia = async () => {
    setLoading(true);
    setNewGame(false);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      totalQuestions.value,
      difficulty.value
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const difficultyOptions = [
    { value: Difficulty.EASY, label: "Easy" },
    { value: Difficulty.MEDIUM, label: "Medium" },
    { value: Difficulty.HARD, label: "Hard" },
  ];

  const amountOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 30, label: "30" },
    { value: 40, label: "40" },
    { value: 50, label: "50" },
  ];

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      //Check answer against correct answer
      const correct = questions[number].correct_answer === answer;

      if (correct) setScore((prev) => prev + 1);

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if (nextQuestion === totalQuestions.value) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {newGame ? (
          <Select
            className="select"
            options={difficultyOptions}
            defaultValue={difficulty}
            onChange={(difficulty) => {
              if (difficulty) {
                setDifficulty(difficulty);
              }
            }}
          />
        ) : null}
        {newGame ? (
          <Select
            className="select"
            options={amountOptions}
            defaultValue={totalQuestions}
            onChange={(total) => {
              if (total) {
                setTotalQuestions(total);
              }
            }}
          />
        ) : null}
        {newGame ? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
        ) : null}
        {(gameOver || userAnswers.length === totalQuestions.value) &&
        !newGame ? (
          <button
            className="start"
            onClick={() => {
              setNewGame(true);
            }}
          >
            New Game
          </button>
        ) : null}

        {!gameOver && !newGame && <p className="score">Score: {score}</p>}
        {loading && <p className="loading">Loading Questions...</p>}
        {!loading && !gameOver && !newGame ? (
          <QuestionCard
            questionNr={number + 1}
            totalQuestion={totalQuestions.value}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        ) : null}

        {!gameOver &&
          !loading &&
          !newGame &&
          userAnswers.length === number + 1 &&
          number !== totalQuestions.value - 1 && (
            <button className="next" onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </>
  );
};

export default App;
