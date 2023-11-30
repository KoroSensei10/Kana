<script>
  import kana from '$lib/kana.js';

  const TIMEOUT_DURATION = 800;
  let points = 0;
  let answer = '';
  let wrongAnswer = false;
  const kanaKeys = Object.keys(kana);
  let currentKanaKey = getRandomKanaKey();
  $: backgroundColor = wrongAnswer ? '#ffdddd' : '#f5f5f5';
  let hiragana = true;
  $: currentKanaDisplay = hiragana ? kana[currentKanaKey].hiragana : kana[currentKanaKey].katakana;

  function getRandomKanaKey() {
    const randomIndex = Math.floor(Math.random() * kanaKeys.length);
    return kanaKeys[randomIndex];
  }

  function resetAnswer() {
    answer = '';
    wrongAnswer = false;
  }

  function checkAnswer() {
  if (answer === '') return;
    if (answer.toLowerCase() === currentKanaKey) {
      points++;
      currentKanaKey = getRandomKanaKey();
      resetAnswer();
    } else {
      points = 0;
      wrongAnswer = true;
      setTimeout(resetAnswer, TIMEOUT_DURATION);
    }
  }
</script>

<div class="points-display">Points: {points}</div>
<div class="container" style="background-color: {backgroundColor}">
  <label for="kana-display" class="kana-display">{currentKanaDisplay}</label>
  <input type="text" id="answer-input" bind:value={answer} on:keyup={event => event.key === 'Enter' && checkAnswer()}>
  <button on:click={checkAnswer}>Submit</button>
</div>

<div class="kana-infos">
  <button class:active={hiragana} on:click={() => hiragana = true}>Hiragana</button>
  <button class:active={!hiragana} on:click={() => hiragana = false}>Katakana</button>
</div>
<style>
  .container {
    background-color: #f5f5f5;
    padding: 2rem;
    border-radius: 10px;
    width: 300px;
    height: 150px;
    margin: auto;
    margin-bottom: 1rem; /* Ajout d'un espace en dessous du cadre pour les points */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s; /* Transition pour l'effet rouge */
  }
.container.wrong {
    background-color: #ffdddd; /* Couleur de fond pour mauvaise réponse */
  }


  .kana-display {
    font-size: 3em;
    margin: 0; /* Enlève les marges par défaut */
    text-align: center;
  }

  input {
    font-size: 1em;
    padding: 0.5em;
    margin-top: 1em; /* Espacement entre le kana et l'input */
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 80%; /* Largeur relative au conteneur */
    box-sizing: border-box;
  }

  button {
    background-color: #e0e0e0;
    color: #333;
    border: none;
    padding: 0.5em 1em;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1em;
  }

  .points-display {
    font-weight: bold;
    text-align: center;
    font-size: 1.5em;
    color: #4CAF50;
    margin-bottom: 1rem; /* Espacement entre les points et le cadre */
  }

  .kana-infos {
    background-color: #f5f5f5;
    padding: 2rem;
    border-radius: 10px;
    width: 150px;
    height: 75px;
    margin: auto;
    margin-bottom: 1rem; /* Ajout d'un espace en dessous du cadre pour les points */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .kana-infos button {
    border: none;
    padding: 0.5em 1em;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1em;
  }

  .kana-infos button.active {
    background-color: #ffffff;
    color: #000000;
    cursor: default;
  }
</style>
