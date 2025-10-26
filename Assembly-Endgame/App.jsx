import React from "react";
import { languages } from "./languages";
import { clsx } from "clsx";
import { getFarewellText, getRandomWord } from "./utils";
import  Confetti  from "react-confetti";

export default function AssemblyEndgame() {
  // state values
  const [currentWord, setCurrentWord] = React.useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = React.useState([]);

  // derived values
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessWrong =
    lastGuessLetter && !currentWord.includes(lastGuessLetter);

  // static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function addGuessedLetter(letter) {
    setGuessedLetters((oldGuess) => {
      const letterSet = new Set(oldGuess);
      letterSet.add(letter);
      return Array.from(letterSet);
    });
  }

  const languagesChipElements = languages.map((language, index) => {
    const isLostLanguage = index < wrongGuessCount;
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    const className = clsx("chip", isLostLanguage && "lost");
    return (
      <span key={language.name} className={className} style={styles}>
        {language.name}
      </span>
    );
  });

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealWord = isGameLost || guessedLetters.includes(letter);
    const misssedWordClass = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-word"
    );
    return (
      <span key={index} className={misssedWordClass}>
        {shouldRevealWord ? letter.toUpperCase() : ""}
      </span>
    );
  });

  const keyboardElements = alphabet.split("").map((element) => {
    const isGuessed = guessedLetters.includes(element);
    const isCorrect = isGuessed && currentWord.includes(element);
    const isWrong = isGuessed && !currentWord.includes(element);

    const buttonStyles = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        key={element}
        className={buttonStyles}
        onClick={() => addGuessedLetter(element)}
        disabled={isGameOver}
      >
        {element.toUpperCase()}
      </button>
    );
  });

  const statusClassName = clsx("status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessWrong,
  });

  const gameStatusMessage = () => {
    if (!isGameOver && isLastGuessWrong) {
      return (
        <p className="farewell-message">
          {" "}
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p> Well done! 🎉 </p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p> You lose! Better start learning Assembly 😭 </p>
        </>
      );
    }
  };

  function resetGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }
  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={statusClassName}>{gameStatusMessage()}</section>
      <section className="languages-container">{languagesChipElements}</section>
      <section className="word-container">{letterElements}</section>
      <section className="keyboard-container">{keyboardElements}</section>
      {isGameOver && (
        <button className="new-game" onClick={resetGame}>
          New Game
        </button>
      )}
    </main>
  );
}
