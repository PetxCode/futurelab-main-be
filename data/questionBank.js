// Question Bank for Code Battle - Organized by Learning Progression
// Each level has 10 questions focused on a specific fundamental topic
// Questions are direct code challenges without function wrappers

const questionLevels = {
  // LEVEL 1: VARIABLES (Declaration, Assignment, Basic Operations)
  1: [
    {
      id: 1,
      level: 1,
      title: "Declare a Variable",
      description: "Create a variable named `myName` and assign it the value 'John'. Then write the variable name to return it.",
      starterCode: "// Declare your variable here\n",
      testCase: "myName === 'John'",
      solution: "const myName = 'John';",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 2,
      level: 1,
      title: "Create a Number Variable",
      description: "Create a variable `age` and assign it the number 25.",
      starterCode: "// Your code here\n",
      testCase: "age === 25",
      solution: "const age = 25;",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 3,
      level: 1,
      title: "Add Two Numbers",
      description: "Create two variables: `a = 5` and `b = 10`. Then create a variable `sum` that stores their sum.",
      starterCode: "// Your code here\n",
      testCase: "sum === 15",
      solution: "const a = 5;\nconst b = 10;\nconst sum = a + b;",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 4,
      level: 1,
      title: "Multiply Two Numbers",
      description: "Create variables `x = 4` and `y = 7`. Create a variable `product` that stores their product.",
      starterCode: "// Your code here\n",
      testCase: "product === 28",
      solution: "const x = 4;\nconst y = 7;\nconst product = x * y;",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 5,
      level: 1,
      title: "Update a Variable",
      description: "Create a variable `count = 0`. Then add 5 to it.",
      starterCode: "let count = 0;\n// Update count here\n",
      testCase: "count === 5",
      solution: "count = count + 5;",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 6,
      level: 1,
      title: "Calculate Average",
      description: "Create three variables with values 10, 20, 30. Create a variable `average` that stores their average.",
      starterCode: "// Your code here\n",
      testCase: "average === 20",
      solution: "const a = 10;\nconst b = 20;\nconst c = 30;\nconst average = (a + b + c) / 3;",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 7,
      level: 1,
      title: "Increment a Variable",
      description: "Create a variable `counter = 5`. Increment it by 1 using the ++ operator.",
      starterCode: "let counter = 5;\n// Increment here\n",
      testCase: "counter === 6",
      solution: "counter++;",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 8,
      level: 1,
      title: "Decrement a Variable",
      description: "Create a variable `lives = 3`. Decrease it by 1 using the -- operator.",
      starterCode: "let lives = 3;\n// Decrement here\n",
      testCase: "lives === 2",
      solution: "lives--;",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 9,
      level: 1,
      title: "Compound Assignment",
      description: "Create a variable `score = 100`. Add 50 to it using the += operator.",
      starterCode: "let score = 100;\n// Use += here\n",
      testCase: "score === 150",
      solution: "score += 50;",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 10,
      level: 1,
      title: "Subtract Numbers",
      description: "Create variables `total = 100` and `spent = 35`. Create a variable `remaining` that stores the difference.",
      starterCode: "// Your code here\n",
      testCase: "remaining === 65",
      solution: "const total = 100;\nconst spent = 35;\nconst remaining = total - spent;",
      difficulty: "easy",
      topic: "Variables"
    }
  ],

  // LEVEL 2: DATATYPES (Strings, Numbers, Booleans)
  2: [
    {
      id: 11,
      level: 2,
      title: "Create a String",
      description: "Create a variable `greeting` with the string value 'Hello World'.",
      starterCode: "// Your code here\n",
      testCase: "greeting === 'Hello World'",
      solution: "const greeting = 'Hello World';",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 12,
      level: 2,
      title: "Create a Number",
      description: "Create a variable `answer` with the number value 42.",
      starterCode: "// Your code here\n",
      testCase: "answer === 42",
      solution: "const answer = 42;",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 13,
      level: 2,
      title: "Create a Boolean",
      description: "Create a variable `isActive` with the boolean value true.",
      starterCode: "// Your code here\n",
      testCase: "isActive === true",
      solution: "const isActive = true;",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 14,
      level: 2,
      title: "String Length",
      description: "Create a variable `text = 'JavaScript'`. Create a variable `length` that stores the length of the string.",
      starterCode: "const text = 'JavaScript';\n// Your code here\n",
      testCase: "length === 10",
      solution: "const length = text.length;",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 15,
      level: 2,
      title: "Combine Strings",
      description: "Create variables `first = 'Hello'` and `second = 'World'`. Create a variable `combined` that joins them with a space.",
      starterCode: "const first = 'Hello';\nconst second = 'World';\n// Your code here\n",
      testCase: "combined === 'Hello World'",
      solution: "const combined = first + ' ' + second;",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 16,
      level: 2,
      title: "Add Numbers",
      description: "Create variables `num1 = 15` and `num2 = 27`. Create a variable `total` that stores their sum.",
      starterCode: "const num1 = 15;\nconst num2 = 27;\n// Your code here\n",
      testCase: "total === 42",
      solution: "const total = num1 + num2;",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 17,
      level: 2,
      title: "Check Type",
      description: "Create a variable `value = 'test'`. Create a variable `isString` that checks if value is a string.",
      starterCode: "const value = 'test';\n// Your code here\n",
      testCase: "isString === true",
      solution: "const isString = typeof value === 'string';",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 18,
      level: 2,
      title: "Uppercase String",
      description: "Create a variable `text = 'hello'`. Create a variable `upper` that stores the uppercase version.",
      starterCode: "const text = 'hello';\n// Your code here\n",
      testCase: "upper === 'HELLO'",
      solution: "const upper = text.toUpperCase();",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 19,
      level: 2,
      title: "Compare Numbers",
      description: "Create variables `a = 10` and `b = 5`. Create a variable `isGreater` that checks if a is greater than b.",
      starterCode: "const a = 10;\nconst b = 5;\n// Your code here\n",
      testCase: "isGreater === true",
      solution: "const isGreater = a > b;",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 20,
      level: 2,
      title: "Boolean AND",
      description: "Create variables `isActive = true` and `isValid = true`. Create a variable `bothTrue` using the && operator.",
      starterCode: "const isActive = true;\nconst isValid = true;\n// Your code here\n",
      testCase: "bothTrue === true",
      solution: "const bothTrue = isActive && isValid;",
      difficulty: "easy",
      topic: "Datatypes"
    }
  ],

  // LEVEL 3: ARRAYS (Creating, Accessing, Manipulating)
  3: [
    {
      id: 21,
      level: 3,
      title: "Create an Array",
      description: "Create a variable `numbers` with an array containing 1, 2, 3, 4, 5.",
      starterCode: "// Your code here\n",
      testCase: "numbers.length === 5",
      solution: "const numbers = [1, 2, 3, 4, 5];",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 22,
      level: 3,
      title: "Access Array Element",
      description: "Create a variable `arr = [10, 20, 30]`. Create a variable `first` that stores the first element.",
      starterCode: "const arr = [10, 20, 30];\n// Your code here\n",
      testCase: "first === 10",
      solution: "const first = arr[0];",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 23,
      level: 3,
      title: "Array Length",
      description: "Create a variable `arr = ['a', 'b', 'c', 'd']`. Create a variable `size` that stores the array length.",
      starterCode: "const arr = ['a', 'b', 'c', 'd'];\n// Your code here\n",
      testCase: "size === 4",
      solution: "const size = arr.length;",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 24,
      level: 3,
      title: "Add to Array",
      description: "Create a variable `arr = [1, 2, 3]`. Add the number 4 to the end using push().",
      starterCode: "const arr = [1, 2, 3];\n// Your code here\n",
      testCase: "arr.length === 4",
      solution: "arr.push(4);",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 25,
      level: 3,
      title: "Remove Last Element",
      description: "Create a variable `arr = [1, 2, 3, 4, 5]`. Remove the last element using pop().",
      starterCode: "const arr = [1, 2, 3, 4, 5];\n// Your code here\n",
      testCase: "arr.length === 4",
      solution: "arr.pop();",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 26,
      level: 3,
      title: "Check if Array Includes",
      description: "Create a variable `arr = [1, 2, 3, 4, 5]`. Create a variable `hasThree` that checks if array includes 3.",
      starterCode: "const arr = [1, 2, 3, 4, 5];\n// Your code here\n",
      testCase: "hasThree === true",
      solution: "const hasThree = arr.includes(3);",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 27,
      level: 3,
      title: "Join Array",
      description: "Create a variable `arr = ['Hello', 'World']`. Create a variable `joined` that joins them with a space.",
      starterCode: "const arr = ['Hello', 'World'];\n// Your code here\n",
      testCase: "joined === 'Hello World'",
      solution: "const joined = arr.join(' ');",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 28,
      level: 3,
      title: "Reverse Array",
      description: "Create a variable `arr = [1, 2, 3]`. Create a variable `reversed` that stores the reversed array.",
      starterCode: "const arr = [1, 2, 3];\n// Your code here\n",
      testCase: "reversed[0] === 3",
      solution: "const reversed = arr.reverse();",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 29,
      level: 3,
      title: "Get Last Element",
      description: "Create a variable `arr = [1, 2, 3, 4, 5]`. Create a variable `last` that stores the last element.",
      starterCode: "const arr = [1, 2, 3, 4, 5];\n// Your code here\n",
      testCase: "last === 5",
      solution: "const last = arr[arr.length - 1];",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 30,
      level: 3,
      title: "Slice Array",
      description: "Create a variable `arr = [1, 2, 3, 4, 5]`. Create a variable `sliced` that gets the first 3 elements.",
      starterCode: "const arr = [1, 2, 3, 4, 5];\n// Your code here\n",
      testCase: "sliced.length === 3",
      solution: "const sliced = arr.slice(0, 3);",
      difficulty: "easy",
      topic: "Arrays"
    }
  ],

  // LEVEL 4: OBJECTS (Creating, Accessing, Modifying Properties)
  4: [
    {
      id: 31,
      level: 4,
      title: "Create an Object",
      description: "Create a variable `person` with properties: name = 'John', age = 25.",
      starterCode: "// Your code here\n",
      testCase: "person.name === 'John'",
      solution: "const person = {name: 'John', age: 25};",
      difficulty: "easy",
      topic: "Objects"
    },
    {
      id: 32,
      level: 4,
      title: "Access Property",
      description: "Create a variable `person = {name: 'Alice', age: 30}`. Create a variable `userName` that stores the name.",
      starterCode: "const person = {name: 'Alice', age: 30};\n// Your code here\n",
      testCase: "userName === 'Alice'",
      solution: "const userName = person.name;",
      difficulty: "easy",
      topic: "Objects"
    },
    {
      id: 33,
      level: 4,
      title: "Add Property",
      description: "Create a variable `person = {name: 'Bob'}`. Add a property `city` with value 'New York'.",
      starterCode: "const person = {name: 'Bob'};\n// Your code here\n",
      testCase: "person.city === 'New York'",
      solution: "person.city = 'New York';",
      difficulty: "easy",
      topic: "Objects"
    },
    {
      id: 34,
      level: 4,
      title: "Get Object Keys",
      description: "Create a variable `obj = {a: 1, b: 2, c: 3}`. Create a variable `keys` that stores all keys as an array.",
      starterCode: "const obj = {a: 1, b: 2, c: 3};\n// Your code here\n",
      testCase: "keys.length === 3",
      solution: "const keys = Object.keys(obj);",
      difficulty: "easy",
      topic: "Objects"
    },
    {
      id: 35,
      level: 4,
      title: "Get Object Values",
      description: "Create a variable `obj = {x: 10, y: 20, z: 30}`. Create a variable `values` that stores all values as an array.",
      starterCode: "const obj = {x: 10, y: 20, z: 30};\n// Your code here\n",
      testCase: "values.length === 3",
      solution: "const values = Object.values(obj);",
      difficulty: "easy",
      topic: "Objects"
    },
    {
      id: 36,
      level: 4,
      title: "Check Property Exists",
      description: "Create a variable `person = {name: 'John', age: 25}`. Create a variable `hasName` that checks if 'name' property exists.",
      starterCode: "const person = {name: 'John', age: 25};\n// Your code here\n",
      testCase: "hasName === true",
      solution: "const hasName = 'name' in person;",
      difficulty: "easy",
      topic: "Objects"
    },
    {
      id: 37,
      level: 4,
      title: "Update Property",
      description: "Create a variable `person = {name: 'John', age: 25}`. Update the age to 26.",
      starterCode: "const person = {name: 'John', age: 25};\n// Your code here\n",
      testCase: "person.age === 26",
      solution: "person.age = 26;",
      difficulty: "easy",
      topic: "Objects"
    },
    {
      id: 38,
      level: 4,
      title: "Delete Property",
      description: "Create a variable `person = {name: 'John', age: 25, city: 'NYC'}`. Delete the city property.",
      starterCode: "const person = {name: 'John', age: 25, city: 'NYC'};\n// Your code here\n",
      testCase: "person.city === undefined",
      solution: "delete person.city;",
      difficulty: "easy",
      topic: "Objects"
    },
    {
      id: 39,
      level: 4,
      title: "Nested Object Access",
      description: "Create a variable `data = {user: {name: 'Alice', age: 30}}`. Create a variable `userName` that gets the nested name.",
      starterCode: "const data = {user: {name: 'Alice', age: 30}};\n// Your code here\n",
      testCase: "userName === 'Alice'",
      solution: "const userName = data.user.name;",
      difficulty: "medium",
      topic: "Objects"
    },
    {
      id: 40,
      level: 4,
      title: "Merge Objects",
      description: "Create variables `obj1 = {a: 1}` and `obj2 = {b: 2}`. Create a variable `merged` that combines them.",
      starterCode: "const obj1 = {a: 1};\nconst obj2 = {b: 2};\n// Your code here\n",
      testCase: "merged.b === 2",
      solution: "const merged = {...obj1, ...obj2};",
      difficulty: "medium",
      topic: "Objects"
    }
  ],

  // LEVEL 5: ADVANCED (Functions, Conditionals, Loops)
  5: [
    {
      id: 41,
      level: 5,
      title: "If Statement",
      description: "Create a variable `num = 10`. Create a variable `result` that is 'positive' if num > 0, else 'negative'.",
      starterCode: "const num = 10;\n// Your code here\n",
      testCase: "result === 'positive'",
      solution: "let result;\nif (num > 0) {\n  result = 'positive';\n} else {\n  result = 'negative';\n}",
      difficulty: "easy",
      topic: "Conditionals"
    },
    {
      id: 42,
      level: 5,
      title: "Ternary Operator",
      description: "Create a variable `num = 4`. Create a variable `type` using ternary: 'even' if num is even, else 'odd'.",
      starterCode: "const num = 4;\n// Your code here\n",
      testCase: "type === 'even'",
      solution: "const type = num % 2 === 0 ? 'even' : 'odd';",
      difficulty: "easy",
      topic: "Conditionals"
    },
    {
      id: 43,
      level: 5,
      title: "For Loop Sum",
      description: "Use a for loop to sum numbers from 1 to 5. Store the result in a variable `total`.",
      starterCode: "// Your code here\n",
      testCase: "total === 15",
      solution: "let total = 0;\nfor(let i = 1; i <= 5; i++) {\n  total += i;\n}",
      difficulty: "medium",
      topic: "Loops"
    },
    {
      id: 44,
      level: 5,
      title: "While Loop",
      description: "Use a while loop to count from 1 to 5. Store the final count in a variable `count`.",
      starterCode: "// Your code here\n",
      testCase: "count === 5",
      solution: "let count = 0;\nwhile(count < 5) {\n  count++;\n}",
      difficulty: "medium",
      topic: "Loops"
    },
    {
      id: 45,
      level: 5,
      title: "Array Filter",
      description: "Create a variable `numbers = [1, 2, 3, 4, 5, 6]`. Create a variable `evens` with only even numbers.",
      starterCode: "const numbers = [1, 2, 3, 4, 5, 6];\n// Your code here\n",
      testCase: "evens.length === 3",
      solution: "const evens = numbers.filter(n => n % 2 === 0);",
      difficulty: "medium",
      topic: "Arrays"
    },
    {
      id: 46,
      level: 5,
      title: "Array Map",
      description: "Create a variable `numbers = [1, 2, 3, 4, 5]`. Create a variable `doubled` that doubles each number.",
      starterCode: "const numbers = [1, 2, 3, 4, 5];\n// Your code here\n",
      testCase: "doubled[0] === 2",
      solution: "const doubled = numbers.map(n => n * 2);",
      difficulty: "medium",
      topic: "Arrays"
    },
    {
      id: 47,
      level: 5,
      title: "Array Reduce",
      description: "Create a variable `numbers = [1, 2, 3, 4, 5]`. Use reduce to create a variable `sum` with the total.",
      starterCode: "const numbers = [1, 2, 3, 4, 5];\n// Your code here\n",
      testCase: "sum === 15",
      solution: "const sum = numbers.reduce((total, n) => total + n, 0);",
      difficulty: "medium",
      topic: "Arrays"
    },
    {
      id: 48,
      level: 5,
      title: "Find Maximum",
      description: "Create a variable `numbers = [3, 7, 2, 9, 1]`. Create a variable `max` that stores the largest number.",
      starterCode: "const numbers = [3, 7, 2, 9, 1];\n// Your code here\n",
      testCase: "max === 9",
      solution: "const max = Math.max(...numbers);",
      difficulty: "easy",
      topic: "Arrays"
    },
    {
      id: 49,
      level: 5,
      title: "String Split",
      description: "Create a variable `text = 'Hello World'`. Create a variable `words` that splits it into an array.",
      starterCode: "const text = 'Hello World';\n// Your code here\n",
      testCase: "words.length === 2",
      solution: "const words = text.split(' ');",
      difficulty: "easy",
      topic: "Strings"
    },
    {
      id: 50,
      level: 5,
      title: "Template Literals",
      description: "Create variables `name = 'John'` and `age = 25`. Create a variable `message` using template literals: 'My name is John and I am 25'.",
      starterCode: "const name = 'John';\nconst age = 25;\n// Your code here\n",
      testCase: "message === 'My name is John and I am 25'",
      solution: "const message = `My name is ${name} and I am ${age}`;",
      difficulty: "easy",
      topic: "Strings"
    }
  ]
};

// Helper function to get questions by level
const getQuestionsByLevel = (level) => {
  return questionLevels[level] || [];
};

// Helper function to get all questions as flat array
const getAllQuestions = () => {
  return Object.values(questionLevels).flat();
};

module.exports = { 
  questionLevels, 
  getQuestionsByLevel, 
  getAllQuestions 
};
