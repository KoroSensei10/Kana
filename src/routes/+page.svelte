<script lang="ts">
	import kana from '$lib/kana';
	import { onMount } from 'svelte';

	const TIMEOUT_DURATION = 800;
	let points: number = $state(0);
	let answer: string = $state('');
	let wrongAnswer: boolean = $state(false);

	const kanaKeys: string[] = Object.keys(kana);
	function getRandomKanaKey(): string {
		const randomIndex = Math.floor(Math.random() * kanaKeys.length);
		return kanaKeys[randomIndex];
	}
	let currentKanaKey = $state(getRandomKanaKey());
	let hiragana = $state(true);
	let currentKanaDisplay: string = $derived(
		hiragana ? kana[currentKanaKey].hiragana : kana[currentKanaKey].katakana
	);

	function resetAnswer() {
		answer = '';
		wrongAnswer = false;
	}

	function handleWrongAnswer() {
		saveHighScore(points);
		points = 0;
		wrongAnswer = true;
		setTimeout(resetAnswer, TIMEOUT_DURATION);
	}

	function checkAnswer() {
		if (answer === '') return;
		if (answer.toLowerCase() === currentKanaKey) {
			points++;
			currentKanaKey = getRandomKanaKey();
			resetAnswer();
		} else {
			handleWrongAnswer();
			points = 0;
			wrongAnswer = true;
			setTimeout(resetAnswer, TIMEOUT_DURATION);
		}
	}
	// HighScores
	let highScores: HighScore[] = $state([]);
	class HighScore {
		points: number = $state(0);
		constructor(points: number) {
			this.points = points;
		}
	}
	function saveHighScore(points: number) {
		highScores = [...highScores, new HighScore(points)]
			.sort((a, b) => b.points - a.points)
			.slice(0, 5);
	}
	$effect(() => {
		if (highScores.length === 0) return;
		localStorage.setItem('highScores', highScores.map((score) => score.points).toString());
	});

	onMount(() => {
		const highScoresString = localStorage.getItem('highScores');
		if (highScoresString) {
			const highScoresArray = highScoresString.split(',').map((score) => parseInt(score));
			highScores = highScoresArray.map((score) => new HighScore(score));
		}
	});

</script>

<!-- Display the points and the current kana -->
<div class="points-display">Points: {points}</div>
<div class:wrong_answer={wrongAnswer} class="container">
	<label for="kana-display" class="kana-display">{currentKanaDisplay}</label>
	<input
		type="text"
		id="answer-input"
		bind:value={answer}
		on:keyup={(event) => event.key === 'Enter' && checkAnswer()}
	/>
	<button on:click={checkAnswer}>Submit</button>
</div>

<!-- Switch between Hiragana and Katakana -->
<div class="kana-infos container">
	<button class:active={hiragana} on:click={() => (hiragana = true)}>Hiragana</button>
	<button class:active={!hiragana} on:click={() => (hiragana = false)}>Katakana</button>
</div>

<!-- HighScore of the player -->
<div class="container">
	<h2>HighScores</h2>
	{#if highScores.length > 0}
		<ul>
			{#each highScores as score}
				<li>{score.points}</li>
			{/each}
		</ul>
	{:else}
		<p>No highscore yet</p>
	{/if}
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

	.wrong_answer {
		background-color: #ff5d5d !important;
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
		color: #4caf50;
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
