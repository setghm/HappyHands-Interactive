function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function range(n) {
	return [...Array(n).keys()]
}

function randomIndex(array) {
	return Math.floor(Math.random() * array.length)
}

function randomElement(array) {
	return array[randomIndex(array)]
}

function randomRange(min, max) {
	return Math.round(Math.random() * (max - min) + min)
}

function randomArrayElement(array, dontRepeatThese=null) {
	if (dontRepeatThese != null) {
		let element
		
		do {
			element = randomElement(array)
		} while(dontRepeatThese.includes(element))
		
		return element
	} else {
		return randomElement(array)
	}
}

function randomAnimal(dontRepeatThese=null) {
	return randomArrayElement(ANIMALS, dontRepeatThese)
}

function randomShape(dontRepeatThese=null) {
	return randomArrayElement(SHAPES, dontRepeatThese)
}

function generateAnimalAnswers(n=3) {
	let options = []
	
	options.push(randomAnimal())
	for (let i=1; i<n; i++) {
		options.push(randomAnimal(options))
	}
	
	let answer = randomElement(range(n))
	
	return {
		options: options,
		answer: answer
	}
}

function generateAnimalWordAnswers(n=3) {
	let object = randomAnimal()
	let word = object.name.toUpperCase()
	let options = []
	
	let answerIndex
	
	do {
		answerIndex = randomIndex(word)
		answerChar = word[answerIndex]
	} while(answerChar === ' ')
	
	options.push(answerChar)
	
	for (let i=1; i<n; i++) {
		let index
		let char
		
		if (word.length <= 4) {
			const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			do {
				index = randomIndex(word)
				char = letters[index]
			} while (options.includes(char))
		} else {
			do {
				index = randomIndex(word)
				char = word[index]
			} while(options.includes(char) || char === ' ')
		}
		
		options.push(char)
	}
	
	word = word.substring(0, answerIndex) + '_' + word.substring(answerIndex + 1);
	
	shuffle(options)
	
	let answer = options.findIndex(char => char == answerChar)
	
	return {
		object: object,
		word: word,
		options: options,
		answer: answer
	}
}

function generateShapeBorders(n=3) {
	let shapes = []
	
	for (let i=0; i<n; i++) {
		shapes.push(randomShape(shapes))
	}
	
	return shapes
}

function generateRandomFallingShape(shapes=null) {
	return {
		shape: shapes ? randomElement(shapes) : randomShape(),
		column: randomRange(1, 3)
	}
}

function shapesColliding(rect1, rect2) {
	return	((rect1.top >= rect2.top) && (rect1.top <= rect2.bottom)) ||
			((rect2.top >= rect1.top) && (rect2.top <= rect1.bottom))
}

function cardMove(divCard, percentaje) {
	if (!divCard.pMoved)
		divCard.pMoved = 0
	divCard.pMoved += percentaje
	divCard.style.transform = `translateX(${divCard.pMoved}%)`
}

function cardMoveLeft(divCard) {
	cardMove(divCard, -100)
}

function cardMoveRight(divCard) {
	cardMove(divCard, 100)
}
