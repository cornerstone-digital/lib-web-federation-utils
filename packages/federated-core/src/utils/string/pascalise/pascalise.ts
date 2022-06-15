const pascalise = (str: string) => {
  // Replace spaces with hyphens.
  const hyphenated = str.replace(/\s/g, '-')

  // Splits hyphenated string into an array of words.
  const words = hyphenated.split('-')

  // Uppercase first letter of each word.
  const pascalCased = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  // Joins pascalCased array into a string.
  return pascalCased.join('')
}

export default pascalise
