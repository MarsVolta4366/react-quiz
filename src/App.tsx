import React, { useState } from 'react'
import { fetchQuizQuestions, Difficulty, QuestionState } from './API'
import QuestionCard from './components/QuestionCard'

// At 1hr in video, rest of video is styling: https://www.youtube.com/watch?v=F2JCjVSZlG0

const TOTAL_QUESTIONS = 10

export type AnswerObject = {
  question: string
  answer: string
  correct: boolean
  correctAnswer: string
}

const App = () => {

  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  console.log(questions)

  const startTrivia = async () => {
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY)

    setQuestions(newQuestions)
    setScore(0)
    setUserAnswers([])
    setNumber(0)
    setLoading(false)
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // Users answer
      const answer = e.currentTarget.value
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer
      // Add to score if answer is correct
      if (correct) {
        setScore(prevScore => prevScore + 1)
      }
      // Save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers(prev => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    // Move on to next question if not on the last question
    const nextQuestion = number + 1

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  }

  return (
    <div className="App">
      <h1>React Quiz</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>Start</button>
      ) : null}
      {!gameOver && <p className="score">Score: {score}</p>}
      {loading && <p>Loading Questions...</p>}
      {!loading && !gameOver && (
        <QuestionCard
          questionNumber={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}
      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
        <button className="next" onClick={nextQuestion}>Next Question</button>
      ) : null}
    </div>
  )
}

export default App
