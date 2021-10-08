// @ts-check
// Formatting, Linting, Type Checking
// Formatting : Prettier
// Linting: ESLint

/* eslint-disable-next-line no-console */
const people = [
  { age: 20, city: '서울', pet: ['cat', 'dog'] },
  { age: 40, city: '부산' },
  { age: 31, city: '대구', pet: ['cat', 'dog'] },
  { age: 36, city: '서울' },
  { age: 27, city: '부산', pet: 'cat' },
  { age: 24, city: '서울', pet: 'dog' },
]

function solveA() {
  const cities = []

  for (const person of people) {
    if (person.age < 30) {
      if (!cities.find((city) => person.city === city)) {
        cities.push(person.city)
      }
    }
  }

  return cities
}

function solveAModern() {
  const allCities = people.filter(({ age }) => age < 30).map(({ city }) => city)
  const set = new Set(allCities)
  return Array.from(set)
}

// console.log('solveA', solveA())
// console.log('solveAModern', solveAModern())

/** @typedef {Object.<string, Object.<string, number>>} PetsOfCities */

function solveB() {
  /** @type {PetsOfCities} */
  const result = {}

  for (const person of people) {
    const { city, pet: petOrPets } = person

    if (petOrPets) {
      const petsOfCity = result[city] || {}
      if (typeof petOrPets === 'string') {
        const pet = petOrPets

        const origNumPetsOfCity = petsOfCity[pet] || 0
        petsOfCity[pet] = origNumPetsOfCity + 1
      } else {
        for (const pet of petOrPets) {
          const origNumPetsOfCity = petsOfCity[pet] || 0
          petsOfCity[pet] = origNumPetsOfCity + 1
        }
      }

      result[city] = petsOfCity
    }
  }

  return result
}

function solveBModern() {
  return people
    .map(({ pet: petOrPets, city }) => {
      const pets =
        (typeof petOrPets === 'string' ? [petOrPets] : petOrPets) || []

      return { city, pets }
    })
    .flatMap(({ city, pets }) => pets.map((pet) => [city, pet]))
    .reduce((/** @type {PetsOfCities}  */ result, [city, pet]) => {
      if (!city || !pet) {
        return result
      }

      return {
        ...result,

        [city]: {
          ...result[city],
          [pet]: (result[city]?.[pet] || 0) + 1,
        },
      }
    }, {})
}

console.log('solveB', solveB())
console.log('solveBModern', solveBModern())
