const resultCorrect = document.querySelector('div#correct')
const resultIncorrect = document.querySelector('div#incorrect')
const h1Instructions = document.querySelector('h1.instructions')
const divAnswer1 = divGame.querySelector('.answer-1')
const divAnswer2 = divGame.querySelector('.answer-2')
const divAnswer3 = divGame.querySelector('.answer-3')
const divGamePalabras = divGame.querySelector('.game-palabras')
const divGameDestreza = divGame.querySelector('.game-destreza')
const divGameMemoria = divGame.querySelector('.game-memoria')
const divGameCat = divGame.querySelector('.game-cat')
const divGameOptions = divGame.querySelector('.options')

let GAME_ANSWER

let play
let cleanupCallback
let selectedCallback
let stopOptionSelectedExecution

function initialGameState() {
	divAnswer1.style.backgroundImage = 'none'
	divAnswer2.style.backgroundImage = 'none'
	divAnswer3.style.backgroundImage = 'none'
	divAnswer1.textContent = ''
	divAnswer2.textContent = ''
	divAnswer3.textContent = ''
	
	h1Instructions.classList.remove('hidden')
	divGameOptions.classList.remove('hidden')
	divGamePalabras.classList.add('hidden')
	divGameDestreza.classList.add('hidden')
	divGameMemoria.classList.add('hidden')
	divGameCat.classList.remove('words')
	actionsDisabled = true
	
	cleanupCallback()
}

function startGame(category) {
	play = () => {}
	cleanupCallback = () => {}
	selectedCallback = () => {}
	stopOptionSelectedExecution = false
	
	switch(category) {
		case 'reconocer-objetos':
			play = () => gameObjectDetection()
			break
		case 'palabras':
			play = () => gameWords()
			break
		case 'memoria':
			play = () => {
				actionsDisabled = true
				gameMemory()
			}
			break
		case 'destreza':
			play = () => {
				actionsDisabled = true
				gameSkill()
			}
			break
	}
	
	play()
}

function gameObjectDetection(divGameCat) {
	actionsDisabled = false
	const reagents = generateAnimalAnswers()
	let animalName = reagents.options[reagents.answer].name.toUpperCase()
	
	h1Instructions.textContent = GAMES.ObjectDetection.instruction + animalName
	divAnswer1.style.backgroundImage = `url("${reagents.options[0].img}")`
	divAnswer2.style.backgroundImage = `url("${reagents.options[1].img}")`
	divAnswer3.style.backgroundImage = `url("${reagents.options[2].img}")`
	
	GAME_ANSWER = reagents.answer
}

function gameWords() {
	actionsDisabled = false
	const divWordObject = divGame.querySelector('#word-object')
	const divWordText = divGame.querySelector('#word-text')
	
	divGamePalabras.classList.remove('hidden')
	divGameCat.classList.add('words')
	
	const reagents = generateAnimalWordAnswers()
	
	h1Instructions.textContent = GAMES.Words.instruction
	divWordObject.style.backgroundImage = `url("${reagents.object.img}")`
	divWordText.textContent = reagents.word
	
	divAnswer1.innerText = reagents.options[0]
	divAnswer2.innerText = reagents.options[1]
	divAnswer3.innerText = reagents.options[2]
	
	GAME_ANSWER = reagents.answer
}

function gameMemory() {
	// Create a local function for modify each card
	const modifyCard = (cardNum, cardName, cardImage) => {
		const divCard = divGameMemoria.querySelector(`#card-${cardNum}`)
		
		// Change the image and text of the card
		divCard.querySelector('.card-image').style.backgroundImage = `url('${cardImage}')`
		divCard.querySelector('.card-name').textContent = cardName
		
		// Register a callback when the user clicks a card
		divCard.number = cardNum
		divCard.addEventListener('click', function() {
			if (!actionsDisabled) {
				optionSelected(this.number - 1)
			}
		})
	}
	
	// Create a local functions to flip all the cards
	const flipCards = () => {
		const cards = divGameMemoria.querySelectorAll('.card')
		cards.forEach(card => card.classList.add('flipped'))
	}
	
	// Create a local function to add a border to all the cards
	const setCardsBorder = () => {
		const cards = divGameMemoria.querySelectorAll('.card')
		cards.forEach(card => {
			card.classList.add('border', `border-${card.number}`)
		})
	}
	
	// Create a local function to delete border from cards
	const clearCardsBorder = () => {
		const cards = divGameMemoria.querySelectorAll('.card')
		cards.forEach(card => {
			card.classList.remove('border', `border-${card.number}`)
		})
	}
	
	// Generate new random reagents
	const reagents = generateAnimalAnswers()
	const correctOption = reagents.options[reagents.answer]
	
	// Modify each card with the new reagents
	reagents.options.forEach((option, i) => {
		modifyCard(i+1, option.name.toUpperCase(), option.img)
	})
	
	// Hide not needed elements
	h1Instructions.classList.add('hidden')
	divGameOptions.classList.add('hidden')
	divGameMemoria.classList.remove('hidden')
	
	// Set the title and hide the image from instructions
	const divMemoryObject = divGameMemoria.querySelector('#memory-object')
	const divMemoryText = divGameMemoria.querySelector('#memory-text')
	divMemoryText.textContent = "Memoriza estos animales"
	divMemoryObject.classList.add('hidden')
	
	// Get the cards div elements
	let divCard1 = divGameMemoria.querySelector('#card-1')
	let divCard2 = divGameMemoria.querySelector('#card-2')
	let divCard3 = divGameMemoria.querySelector('#card-3')
	
	// Declare swap timeouts
	let swap1Timeout, swap2Timeout, optionSelectedTimeout
	
	// Register the cleanup callback
	// Remove all styles and translate information from the card div elements
	cleanupCallback = () => {
		clearCardsBorder()
		divCard1.style = ''
		divCard1.pMoved = 0
		divCard2.style = ''
		divCard2.pMoved = 0
		divCard3.style = ''
		divCard3.pMoved = 0
		divCard1.classList.remove('flipped')
		divCard2.classList.remove('flipped')
		divCard3.classList.remove('flipped')
		divCard1.number = 0
		divCard2.number = 0
		divCard3.number = 0
		clearTimeout(swap1Timeout)
		clearTimeout(swap2Timeout)
		clearTimeout(optionSelectedTimeout)
	}
	
	// Register the selected callback
	// Flip the selected card and wait
	selectedCallback = (option) => {
		actionsDisabled = true
		stopOptionSelectedExecution = false
		
		const divSelCard =	(divCard1.number === option + 1) ? divCard1 :
							(divCard2.number === option + 1) ? divCard2 :
							divCard3
		divSelCard.classList.remove('flipped')
		optionSelectedTimeout = setTimeout(() => {
			optionSelected(option)
		}, 1000)
	}
	
	// Set the game answer to modify it later within the random movements
	GAME_ANSWER = reagents.answer
	
	// Random movements
	const movements = [
		// Swap 1 and 2
		() => {
			divCard1.number = 2
			divCard2.number = 1
			cardMoveRight(divCard1)
			cardMoveLeft(divCard2)
			let temp = divCard1
			divCard1 = divCard2
			divCard2 = temp
			GAME_ANSWER = (GAME_ANSWER == 0) ? 1 : (GAME_ANSWER == 1) ? 0 : GAME_ANSWER
		},
		// Swap 2 and 3
		() => {
			divCard2.number = 3
			divCard3.number = 2
			cardMoveRight(divCard2)
			cardMoveLeft(divCard3)
			let temp = divCard2
			divCard2 = divCard3
			divCard3 = temp
			GAME_ANSWER = (GAME_ANSWER == 1) ? 2 : (GAME_ANSWER == 2) ? 1 : GAME_ANSWER
		}
	]
	
	// Generate a new randon number of swappings
	const numMoves = randomRange(1, 3)
	let i = 0
	
	// Swap the cards with 1 second of delay
	swap1Timeout = setTimeout(function swapCards() {
		// Execute one time instructions
		if (i === 0) {
			i++
			// Change instruction text
			divMemoryText.textContent = "Haz memoria..."
			// Flip the cards
			flipCards()
			// Start the swapping
			swap2Timeout = setTimeout(swapCards, 500)
		} else if (i <= numMoves) {
			i++
			const movement = randomElement(movements)
			movement()
			swap2Timeout = setTimeout(swapCards, 1000)
		} else {
			// The swappings just ended
			actionsDisabled = false
			// Set the reagent title image
			divMemoryObject.classList.remove('hidden')
			divMemoryObject.style.backgroundImage = `url('${correctOption.img}')`
			// Set the reagent title text
			divMemoryText.textContent = "¿En dónde está?"
			// Execute the selected callback first
			stopOptionSelectedExecution = true
			// Draw border around the cards
			setCardsBorder()
		}
	}, 8000)
}

function gameSkill() {
	const GENERATION_INTERVAL_TIME = 2000
	let score = 0
	stopOptionSelectedExecution = true
	
	divGameDestreza.classList.remove('hidden')
	divGameOptions.classList.add('hidden')
	
	h1Instructions.textContent = "Presiona el boton del color cuando la figura encaje con la de abajo"
	
	const divShapeBorders = divGameDestreza.querySelectorAll('.figure-border')
	const divShapes = divGameDestreza.querySelectorAll('.figure')
	const divScore = divGameDestreza.querySelector('#skill-score')
	
	divScore.textContent = 0
	
	let shapeClearInterval, randomShapeGeneratorInterval, resultAnimateTimeout1, resultAnimateTimeout2
	let activeColumn
	const shapes = generateShapeBorders()
	
	divShapeBorders.forEach((divShapeBorder, i) => {
		divShapeBorder.style.backgroundImage = `url("${shapes[i].border}")`
		divShapeBorder.addEventListener('click', () => {
			if (!actionsDisabled) {
				optionSelected(i)
			}
		})
	})
	
	selectedCallback = (option) => {
		let good = false
		actionsDisabled = true
		
		const divShapeBorder = divGameDestreza.querySelector(`.figure-border.f-${option+1}`)
		const divShape = divGameDestreza.querySelector(`.figure.f-${option+1}`)
		const divResult = divGameDestreza.querySelector(`.result-mini.f-${activeColumn}`)
		
		const rect1 = divShape.getBoundingClientRect()
		if (GAME_ANSWER === option) {
			const rect2 = divShapeBorder.getBoundingClientRect()
			
			good = shapesColliding(rect1, rect2)
			
			if (good) {
				divScore.textContent = ++score
			}
			
			// Change current shape
			changeShape(option)
		}
		
		cleanupCallback()
		randomShapeGeneratorInterval = setInterval(randomShapeGeneration, GENERATION_INTERVAL_TIME)
		
		divResult.style.top = `${rect1.top}px`
		divResult.classList.add(good ? 'good' : 'bad')
		divResult.classList.add('in')
		divResult.classList.remove('hidden')
		
		resultAnimateTimeout1 = setTimeout(() => {
			divResult.classList.remove('in')
			divResult.classList.add('out')
			resultAnimateTimeout2 = setTimeout(() => {
				divResult.classList.remove('out')
				divResult.classList.add('hidden')
				divResult.classList.remove(good ? 'good' : 'bad')
			}, 125)
		}, 750)
	}
	
	const changeShape = (i) => {
		shapes[i] = randomShape(shapes)
		divShapeBorders[i].style.backgroundImage = `url("${shapes[i].border}")`
	}
	
	const randomShapeGeneration = () => {
		//let shape = generateRandomFallingShape()
		let shape = generateRandomFallingShape(shapes)
		
		const divFallingShape = divGameDestreza.querySelector(`.figure.f-${shape.column}`)
		divFallingShape.style.backgroundImage = `url("${shape.shape.filled}")`
		divFallingShape.classList.add('falling')
		
		activeColumn = shape.column
		actionsDisabled = false
		
		if (shape.shape === shapes[shape.column - 1]) {
			GAME_ANSWER = shape.column - 1
		} else {
			GAME_ANSWER = undefined
		}
		
		shapeClearInterval = setTimeout(() => {
			actionsDisabled = true
			divFallingShape.classList.remove('falling')
			divFallingShape.style.backgroundImage = 'none'
			GAME_ANSWER = undefined
		}, GENERATION_INTERVAL_TIME - 100)
	}
	
	randomShapeGeneratorInterval = setInterval(randomShapeGeneration, GENERATION_INTERVAL_TIME)
	
	cleanupCallback = () => {
		clearInterval(randomShapeGeneratorInterval)
		clearInterval(shapeClearInterval)
		clearTimeout(resultAnimateTimeout1)
		clearTimeout(resultAnimateTimeout2)
		divShapes.forEach(divShape => {
			divShape.classList.remove('falling')
			divShape.style.backgroundImage = 'none'
		})
	}
}

function optionSelected(option) {
	if (stopOptionSelectedExecution) {
		selectedCallback(option)
		return
	}
	
	cleanupCallback()
	
	actionsDisabled = true
	divGame.classList.add('hidden')
	
	if (option === GAME_ANSWER) {
		resultCorrect.classList.remove('hidden')
	} else {
		resultIncorrect.classList.remove('hidden')
	}
	
	setTimeout(() => {
		divGame.classList.remove('hidden')
		resultCorrect.classList.add('hidden')
		resultIncorrect.classList.add('hidden')
		actionsDisabled = false
		play()
	}, 2000)
}
