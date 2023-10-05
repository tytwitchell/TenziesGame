import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [count, setCount] = React.useState(0)
    const [timer, setTimer] = React.useState(0)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])
    
    function startTimer() {
        const intervalId = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000); // Update the timer every 1000 milliseconds (1 second)

        // Save the interval ID to stop the timer when needed
        return intervalId;
    }
    
    function stopTimer(intervalId) {
        clearInterval(intervalId);
    }
    
    React.useEffect(() => {
        if (!tenzies) {
            // start the timer when the game starts
            const intervalId = startTimer();
            // cleanup function to stop the timer when the game ends
            return () => stopTimer(intervalId);
            }
    }, [tenzies]);

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            
            setCount(prevCount => prevCount + 1)
            console.log(count)
            
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setCount(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {
                    value: die.value, 
                    id: die.id,
                    isHeld: !die.isHeld
                } :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti 
                width={window.innerWidth}
                height={window.innerHeight}
            />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className= "footer-container">
                <div className="count-container">
                    <h4>Roll Count</h4>
                    <p>{count}</p>
                </div>
                <button 
                    className="roll-dice" 
                    onClick={rollDice}
                >
                    {tenzies ? "New Game" : "Roll"}
                </button>
                <div className="time-container">
                    <h4>Timer</h4>
                    <p>{timer}</p>
                </div> 
            </div>
        </main>
    )
}