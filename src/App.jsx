import { useState } from 'react'
import { clsx } from "clsx"
import { decode } from "html-entities"

function App() {

    // State values
    const [ currentPage, setCurrentPage ] = useState("starting-page")
    const [ questions, setQuestions ] = useState([])

    function startQuiz() {
        setCurrentPage("quiz-page")
        getTriviaQuestions()
    }

    async function getTriviaQuestions() {
        await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
                            .then(res => res.json())
                            .then(data => setQuestions(data.results))
    }

    const questionElements = questions.map(questionObj => {
        return (
            <div className="question-block">
                <h2>{decode(questionObj.question)}</h2>
                <form name="multiple-choice">
                    <label for={questionObj.correct_answer}>
                        {decode(questionObj.correct_answer)}
                    </label>
                    <input 
                        type="radio" 
                        id={questionObj.correct_answer} 
                        value={questionObj.correct_answer}
                        name="multiple-choice" 
                    />
                    <label for={questionObj.incorrect_answers[0]}>
                        {decode(questionObj.incorrect_answers[0])}
                    </label>
                    <input 
                            type="radio" 
                            id={questionObj.incorrect_answers[0]} 
                            value={questionObj.incorrect_answers[0]}
                            name="multiple-choice" 
                    />
                </form>

                {/* <span>{decode(questionObj.correct_answer)}</span>
                <span>{decode(questionObj.incorrect_answers[0])}</span>
                <span>{decode(questionObj.incorrect_answers[1])}</span>
                <span>{decode(questionObj.incorrect_answers[2])}</span> */}
            </div>
        )
    })

    const blobStyle = clsx({
        quizpage : questions.length > 0
    })

    console.log(blobStyle)

    return (
        <>
            <div className={blobStyle}>
                <div className="yellow-blob"></div>
                <div className="blue-blob"></div>
            </div>
            {currentPage === "starting-page" && <section className="starting-page">
                <h1>Quizzical</h1>
                <p>Test your trivia skills!</p>
                <button onClick={startQuiz}>Start quiz</button>
            </section>}
            {currentPage === "quiz-page" && <section className="quiz-page">
                {questionElements}
                <button>Check answers</button>
            </section>}
        </>
    )
    }

export default App
