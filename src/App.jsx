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
        const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        const data = await res.json().then(data => {
                        const newData = Array.from(data.results)
                            .map(questionObj => {
                                const choicesArray = [...questionObj.incorrect_answers]
                                const randomIndex = Math.floor(Math.random() * (choicesArray.length + 1))
                                choicesArray.splice(randomIndex, 0, questionObj.correct_answer)

                                return {...questionObj, choicesArray}
                            })
                        console.log(newData)
                        setQuestions(newData)
                    })             
    }

    const questionBlock = questions.map(questionObj => {

        const questionElements = questionObj.choicesArray.map(element => {
            return(
                <div key={element} className="radio">
                    <input 
                        type="radio" 
                        id={element} 
                        value={element}
                        name={questionObj.question} 
                    />
                    <label htmlFor={element}>
                        {decode(element)}
                    </label>
                </div>
            )
        })

        return (
            <div className="question-block">
                <h2>{decode(questionObj.question)}</h2>
                <form name="multiple-choice">
                    {questionElements}
                </form>
            </div>
        )
    })

    const blobStyle = clsx({
        quizpage : questions.length > 0
    })

    function revealAnswers() {
        setCurrentPage("answers-page")
    }

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
                {questionBlock}
                <button onClick={revealAnswers}>Check answers</button>
            </section>}
            {currentPage === "answers-page" && <section className="answers-page">
                {questionBlock}
                <div>
                    <span>You scored ?/5 correct answers.</span>
                    <button onClick={startQuiz}>Check answers</button>
                </div>
            </section>}
        </>
    )
    }

export default App
