import { useState } from 'react'
import { clsx } from "clsx"
import { decode } from "html-entities"

function App() {

    // State values
    const [ currentPage, setCurrentPage ] = useState("starting-page")
    const [ questions, setQuestions ] = useState([])

    // Derived value
    const totalCorrect = questions.filter(obj => obj.selectedOption === obj.correct_answer).length

    function startQuiz() {
        setCurrentPage("quiz-page")
        getTriviaQuestions()
    }

    async function getTriviaQuestions() {
        await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(data => {
                const newData = Array.from(data.results)
                    .map(questionObj => {
                        const choicesArray = [...questionObj.incorrect_answers]
                        const randomIndex = Math.floor(Math.random() * (choicesArray.length + 1))
                        choicesArray.splice(randomIndex, 0, questionObj.correct_answer)
                        const selectedOption = ""

                        return {...questionObj, choicesArray, selectedOption}
                    })
                setQuestions(newData)
            })             
    }

    function handleRadioChange(questionId, element) {
        setQuestions(prev => prev.map(obj => 
            obj.question === questionId ? {...obj, selectedOption: element} : obj)
        )
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
                        checked={questionObj.selectedOption === element} 
                        onChange={() => handleRadioChange(questionObj.question, element)}
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
                <fieldset name={questionObj.question}>
                    {questionElements}
                </fieldset>
            </div>
        )
    })

    const answersBlock = questions.map(questionObj => {
        const questionElements = questionObj.choicesArray.map(element => {
            const styles = clsx({
                "wrong": questionObj.selectedOption === element && questionObj.correct_answer !== element,
                "other": questionObj.selectedOption !== element && questionObj.correct_answer !== element,
                "correct": questionObj.correct_answer == element
            })

            return(
                <div key={element} className="radio">
                    <input 
                        type="radio" 
                        id={element} 
                        value={element}
                        name={questionObj.question}
                        disabled={true}
                    />
                    <label htmlFor={element} className={styles}>
                        {decode(element)}
                    </label>
                </div>
            )
        })

        return (
            <div className="question-block">
                <h2>{decode(questionObj.question)}</h2>
                <fieldset name={questionObj.question}>
                    {questionElements}
                </fieldset>
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
                <form>
                    {questionBlock}
                    <button onClick={revealAnswers}>Check answers</button>
                </form>
            </section>}
            {currentPage === "answers-page" && <section className="answers-page">
                {answersBlock}
                <div className="score-container">
                    <span>You correctly answered {totalCorrect}/5</span>
                    <button onClick={startQuiz}>Play again</button>
                </div>
            </section>}
        </>
    )
    }

export default App
