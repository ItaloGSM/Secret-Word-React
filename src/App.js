//CSS
import './App.css';
// REACT
import {useCallback, useEffect, useState} from "react"
// DATA
import {wordsList} from "./data/words"
//COMPONENTS
import StartScreen from './components/StartScreen.js';
import Game from './components/Game.js';
import GameOver from './components/GameOver.js';

const stages = [
  {id:1, name: "start"},
  {id:2, name: "game"},
  {id:3, name: "end"}
]

function App() {

  const[gameStage, setGameStage] = useState(stages[0].name)
  const[words] = useState(wordsList)

  const[pickedWord, setPickedWord] = useState("")
  const[pickedCategory, setPickedCategory] = useState("")
  const[letters, setLetters] = useState("")

  const[guessedLetters, setGuessedLetters] = useState([])
  const[wrongLetters, setWrongLetters] = useState([])
  const[guesses, setGuesses] = useState(3)
  const[score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // PICK A RANDOM CATEGORY
    //Object.keys retorma o nome dos metodos ou strings do objecto 
    const categories = Object.keys(words)
    //Retorna um indice aleatorio do array gerado, utilizando length como valor max do random
    //floor retorna o menor inteiro proximo do valor gerado
    //random gera um valor entre 0 e 1 (decimal) - por isso o retorno nao é inteiro
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    console.log(category)

    // PICK A RANDOM WORD
    
    //Segue uma logica parecida, recupero as palavras da categoria listada acima
    //Uso a logica do random, porém sobre o array de palavras da categoria
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return {word,category}
  }, [words])


  // Start Game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();
    //pickword and pickcategory
    const {word, category} = pickWordAndCategory();

    // create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  },[pickWordAndCategory])

  // Process the letter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter)||wrongLetters.includes(normalizedLetter) ) {
      return;
    }
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses -1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }


  // CHECK LOSE CONDITION
  useEffect(() => {
    if(guesses <= 0){
      clearLetterStates()
      setGameStage(stages[2].name)

    }
  },[guesses])

  // CHECK WIN CONDITION
  useEffect(() => {
    //transforma o array de letras corretas em um array de letras unicas, sem repetição
    const uniqueLetters = [...new Set(letters)]
    // win condition | se o array de letras certas tiver o tamanho do array de letras unicas
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
      // add score
      setScore((Score) => Score += 100)
      // restart game with new word
      startGame()
    }

  },[guessedLetters, letters, startGame, gameStage])

  // Restart
  const retry = () => {
    setScore(0)
    setGuesses(3)
    setGameStage(stages[0].name)
  }


  return (
    <div className="App">
     {gameStage === "start" && <StartScreen startGame={startGame} />}

     {gameStage === "game" && <Game 
      verifyLetter={verifyLetter}
      pickedWord = {pickedWord}
      pickedCategory = {pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}

     {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
