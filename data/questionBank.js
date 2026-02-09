// Question Bank for Code Battle - Python Edition
// Each level has 10 questions focused on a specific fundamental topic
// Questions are direct code challenges without function wrappers

const questionLevels = {
  // LEVEL 1: VARIABLES (Declaration, Assignment, Basic Operations)
  1: [
    {
      id: 1,
      level: 1,
      title: "Declare a Variable",
      description: "Create a variable named `my_name` and assign it the value 'John'.",
      starterCode: "# Declare your variable here\n",
      testCase: "my_name == 'John'",
      solution: "my_name = 'John'",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 2,
      level: 1,
      title: "Create a Number Variable",
      description: "Create a variable `age` and assign it the number 25.",
      starterCode: "# Your code here\n",
      testCase: "age == 25",
      solution: "age = 25",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 3,
      level: 1,
      title: "Add Two Numbers",
      description: "Create two variables: `a = 5` and `b = 10`. Then create a variable `sum` that stores their sum.",
      starterCode: "# Your code here\n",
      testCase: "sum == 15",
      solution: "a = 5\nb = 10\nsum = a + b",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 4,
      level: 1,
      title: "Multiply Two Numbers",
      description: "Create variables `x = 4` and `y = 7`. Create a variable `product` that stores their product.",
      starterCode: "# Your code here\n",
      testCase: "product == 28",
      solution: "x = 4\ny = 7\nproduct = x * y",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 5,
      level: 1,
      title: "Update a Variable",
      description: "Create a variable `count = 0`. Then add 5 to it.",
      starterCode: "count = 0\n# Update count here\n",
      testCase: "count == 5",
      solution: "count = count + 5",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 6,
      level: 1,
      title: "Calculate Average",
      description: "Create three variables with values 10, 20, 30. Create a variable `average` that stores their average.",
      starterCode: "# Your code here\n",
      testCase: "average == 20",
      solution: "a = 10\nb = 20\nc = 30\naverage = (a + b + c) / 3",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 7,
      level: 1,
      title: "Increment a Variable",
      description: "Create a variable `counter = 5`. Increment it by 1.",
      starterCode: "counter = 5\n# Increment here\n",
      testCase: "counter == 6",
      solution: "counter += 1",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 8,
      level: 1,
      title: "Decrement a Variable",
      description: "Create a variable `lives = 3`. Decrease it by 1.",
      starterCode: "lives = 3\n# Decrement here\n",
      testCase: "lives == 2",
      solution: "lives -= 1",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 9,
      level: 1,
      title: "Compound Assignment",
      description: "Create a variable `score = 100`. Add 50 to it using the += operator.",
      starterCode: "score = 100\n# Use += here\n",
      testCase: "score == 150",
      solution: "score += 50",
      difficulty: "easy",
      topic: "Variables"
    },
    {
      id: 10,
      level: 1,
      title: "Subtract Numbers",
      description: "Create variables `total = 100` and `spent = 35`. Create a variable `remaining` that stores the difference.",
      starterCode: "# Your code here\n",
      testCase: "remaining == 65",
      solution: "total = 100\nspent = 35\nremaining = total - spent",
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
      starterCode: "# Your code here\n",
      testCase: "greeting == 'Hello World'",
      solution: "greeting = 'Hello World'",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 12,
      level: 2,
      title: "Create a Number",
      description: "Create a variable `answer` with the number value 42.",
      starterCode: "# Your code here\n",
      testCase: "answer == 42",
      solution: "answer = 42",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 13,
      level: 2,
      title: "Create a Boolean",
      description: "Create a variable `is_active` with the boolean value True.",
      starterCode: "# Your code here\n",
      testCase: "is_active == True",
      solution: "is_active = True",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 14,
      level: 2,
      title: "String Length",
      description: "Create a variable `text = 'Python'`. Create a variable `length` that stores the length of the string.",
      starterCode: "text = 'Python'\n# Your code here\n",
      testCase: "length == 6",
      solution: "length = len(text)",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 15,
      level: 2,
      title: "Combine Strings",
      description: "Create variables `first = 'Hello'` and `second = 'World'`. Create a variable `combined` that joins them with a space.",
      starterCode: "first = 'Hello'\nsecond = 'World'\n# Your code here\n",
      testCase: "combined == 'Hello World'",
      solution: "combined = first + ' ' + second",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 16,
      level: 2,
      title: "Add Numbers",
      description: "Create variables `num1 = 15` and `num2 = 27`. Create a variable `total` that stores their sum.",
      starterCode: "num1 = 15\nnum2 = 27\n# Your code here\n",
      testCase: "total == 42",
      solution: "total = num1 + num2",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 17,
      level: 2,
      title: "Check Type",
      description: "Create a variable `value = 'test'`. Create a variable `is_string` that checks if value is a string.",
      starterCode: "value = 'test'\n# Your code here\n",
      testCase: "is_string == True",
      solution: "is_string = type(value) == str",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 18,
      level: 2,
      title: "Uppercase String",
      description: "Create a variable `text = 'hello'`. Create a variable `upper` that stores the uppercase version.",
      starterCode: "text = 'hello'\n# Your code here\n",
      testCase: "upper == 'HELLO'",
      solution: "upper = text.upper()",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 19,
      level: 2,
      title: "Compare Numbers",
      description: "Create variables `a = 10` and `b = 5`. Create a variable `is_greater` that checks if a is greater than b.",
      starterCode: "a = 10\nb = 5\n# Your code here\n",
      testCase: "is_greater == True",
      solution: "is_greater = a > b",
      difficulty: "easy",
      topic: "Datatypes"
    },
    {
      id: 20,
      level: 2,
      title: "Boolean AND",
      description: "Create variables `is_active = True` and `is_valid = True`. Create a variable `both_true` using the and operator.",
      starterCode: "is_active = True\nis_valid = True\n# Your code here\n",
      testCase: "both_true == True",
      solution: "both_true = is_active and is_valid",
      difficulty: "easy",
      topic: "Datatypes"
    }
  ],

  // LEVEL 3: LISTS (Creating, Accessing, Manipulating)
  3: [
    {
      id: 21,
      level: 3,
      title: "Create a List",
      description: "Create a variable `numbers` with a list containing 1, 2, 3, 4, 5.",
      starterCode: "# Your code here\n",
      testCase: "len(numbers) == 5",
      solution: "numbers = [1, 2, 3, 4, 5]",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 22,
      level: 3,
      title: "Access List Element",
      description: "Create a variable `arr = [10, 20, 30]`. Create a variable `first` that stores the first element.",
      starterCode: "arr = [10, 20, 30]\n# Your code here\n",
      testCase: "first == 10",
      solution: "first = arr[0]",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 23,
      level: 3,
      title: "List Length",
      description: "Create a variable `arr = ['a', 'b', 'c', 'd']`. Create a variable `size` that stores the list length.",
      starterCode: "arr = ['a', 'b', 'c', 'd']\n# Your code here\n",
      testCase: "size == 4",
      solution: "size = len(arr)",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 24,
      level: 3,
      title: "Add to List",
      description: "Create a variable `arr = [1, 2, 3]`. Add the number 4 to the end using append().",
      starterCode: "arr = [1, 2, 3]\n# Your code here\n",
      testCase: "len(arr) == 4",
      solution: "arr.append(4)",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 25,
      level: 3,
      title: "Remove Last Element",
      description: "Create a variable `arr = [1, 2, 3, 4, 5]`. Remove the last element using pop().",
      starterCode: "arr = [1, 2, 3, 4, 5]\n# Your code here\n",
      testCase: "len(arr) == 4",
      solution: "arr.pop()",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 26,
      level: 3,
      title: "Check if List Contains",
      description: "Create a variable `arr = [1, 2, 3, 4, 5]`. Create a variable `has_three` that checks if list contains 3.",
      starterCode: "arr = [1, 2, 3, 4, 5]\n# Your code here\n",
      testCase: "has_three == True",
      solution: "has_three = 3 in arr",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 27,
      level: 3,
      title: "Join List",
      description: "Create a variable `arr = ['Hello', 'World']`. Create a variable `joined` that joins them with a space.",
      starterCode: "arr = ['Hello', 'World']\n# Your code here\n",
      testCase: "joined == 'Hello World'",
      solution: "joined = ' '.join(arr)",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 28,
      level: 3,
      title: "Reverse List",
      description: "Create a variable `arr = [1, 2, 3]`. Create a variable `reversed_arr` that stores the reversed list.",
      starterCode: "arr = [1, 2, 3]\n# Your code here\n",
      testCase: "reversed_arr[0] == 3",
      solution: "reversed_arr = arr[::-1]",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 29,
      level: 3,
      title: "Get Last Element",
      description: "Create a variable `arr = [1, 2, 3, 4, 5]`. Create a variable `last` that stores the last element.",
      starterCode: "arr = [1, 2, 3, 4, 5]\n# Your code here\n",
      testCase: "last == 5",
      solution: "last = arr[-1]",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 30,
      level: 3,
      title: "Slice List",
      description: "Create a variable `arr = [1, 2, 3, 4, 5]`. Create a variable `sliced` that gets the first 3 elements.",
      starterCode: "arr = [1, 2, 3, 4, 5]\n# Your code here\n",
      testCase: "len(sliced) == 3",
      solution: "sliced = arr[:3]",
      difficulty: "easy",
      topic: "Lists"
    }
  ],

  // LEVEL 4: DICTIONARIES (Creating, Accessing, Modifying)
  4: [
    {
      id: 31,
      level: 4,
      title: "Create a Dictionary",
      description: "Create a variable `person` with keys: name = 'John', age = 25.",
      starterCode: "# Your code here\n",
      testCase: "person['name'] == 'John'",
      solution: "person = {'name': 'John', 'age': 25}",
      difficulty: "easy",
      topic: "Dictionaries"
    },
    {
      id: 32,
      level: 4,
      title: "Access Dictionary Value",
      description: "Create a variable `person = {'name': 'Alice', 'age': 30}`. Create a variable `user_name` that stores the name.",
      starterCode: "person = {'name': 'Alice', 'age': 30}\n# Your code here\n",
      testCase: "user_name == 'Alice'",
      solution: "user_name = person['name']",
      difficulty: "easy",
      topic: "Dictionaries"
    },
    {
      id: 33,
      level: 4,
      title: "Add Dictionary Key",
      description: "Create a variable `person = {'name': 'Bob'}`. Add a key `city` with value 'New York'.",
      starterCode: "person = {'name': 'Bob'}\n# Your code here\n",
      testCase: "person['city'] == 'New York'",
      solution: "person['city'] = 'New York'",
      difficulty: "easy",
      topic: "Dictionaries"
    },
    {
      id: 34,
      level: 4,
      title: "Get Dictionary Keys",
      description: "Create a variable `obj = {'a': 1, 'b': 2, 'c': 3}`. Create a variable `keys` that stores all keys as a list.",
      starterCode: "obj = {'a': 1, 'b': 2, 'c': 3}\n# Your code here\n",
      testCase: "len(keys) == 3",
      solution: "keys = list(obj.keys())",
      difficulty: "easy",
      topic: "Dictionaries"
    },
    {
      id: 35,
      level: 4,
      title: "Get Dictionary Values",
      description: "Create a variable `obj = {'x': 10, 'y': 20, 'z': 30}`. Create a variable `values` that stores all values as a list.",
      starterCode: "obj = {'x': 10, 'y': 20, 'z': 30}\n# Your code here\n",
      testCase: "len(values) == 3",
      solution: "values = list(obj.values())",
      difficulty: "easy",
      topic: "Dictionaries"
    },
    {
      id: 36,
      level: 4,
      title: "Check Key Exists",
      description: "Create a variable `person = {'name': 'John', 'age': 25}`. Create a variable `has_name` that checks if 'name' key exists.",
      starterCode: "person = {'name': 'John', 'age': 25}\n# Your code here\n",
      testCase: "has_name == True",
      solution: "has_name = 'name' in person",
      difficulty: "easy",
      topic: "Dictionaries"
    },
    {
      id: 37,
      level: 4,
      title: "Update Dictionary Value",
      description: "Create a variable `person = {'name': 'John', 'age': 25}`. Update the age to 26.",
      starterCode: "person = {'name': 'John', 'age': 25}\n# Your code here\n",
      testCase: "person['age'] == 26",
      solution: "person['age'] = 26",
      difficulty: "easy",
      topic: "Dictionaries"
    },
    {
      id: 38,
      level: 4,
      title: "Delete Dictionary Key",
      description: "Create a variable `person = {'name': 'John', 'age': 25, 'city': 'NYC'}`. Delete the city key.",
      starterCode: "person = {'name': 'John', 'age': 25, 'city': 'NYC'}\n# Your code here\n",
      testCase: "'city' not in person",
      solution: "del person['city']",
      difficulty: "easy",
      topic: "Dictionaries"
    },
    {
      id: 39,
      level: 4,
      title: "Nested Dictionary Access",
      description: "Create a variable `data = {'user': {'name': 'Alice', 'age': 30}}`. Create a variable `user_name` that gets the nested name.",
      starterCode: "data = {'user': {'name': 'Alice', 'age': 30}}\n# Your code here\n",
      testCase: "user_name == 'Alice'",
      solution: "user_name = data['user']['name']",
      difficulty: "medium",
      topic: "Dictionaries"
    },
    {
      id: 40,
      level: 4,
      title: "Merge Dictionaries",
      description: "Create variables `obj1 = {'a': 1}` and `obj2 = {'b': 2}`. Create a variable `merged` that combines them.",
      starterCode: "obj1 = {'a': 1}\nobj2 = {'b': 2}\n# Your code here\n",
      testCase: "merged['b'] == 2",
      solution: "merged = {**obj1, **obj2}",
      difficulty: "medium",
      topic: "Dictionaries"
    }
  ],

  // LEVEL 5: ADVANCED (Conditionals, Loops, List Comprehensions)
  5: [
    {
      id: 41,
      level: 5,
      title: "If Statement",
      description: "Create a variable `num = 10`. Create a variable `result` that is 'positive' if num > 0, else 'negative'.",
      starterCode: "num = 10\n# Your code here\n",
      testCase: "result == 'positive'",
      solution: "if num > 0:\n    result = 'positive'\nelse:\n    result = 'negative'",
      difficulty: "easy",
      topic: "Conditionals"
    },
    {
      id: 42,
      level: 5,
      title: "Ternary Expression",
      description: "Create a variable `num = 4`. Create a variable `type` using ternary: 'even' if num is even, else 'odd'.",
      starterCode: "num = 4\n# Your code here\n",
      testCase: "type == 'even'",
      solution: "type = 'even' if num % 2 == 0 else 'odd'",
      difficulty: "easy",
      topic: "Conditionals"
    },
    {
      id: 43,
      level: 5,
      title: "For Loop Sum",
      description: "Use a for loop to sum numbers from 1 to 5. Store the result in a variable `total`.",
      starterCode: "# Your code here\n",
      testCase: "total == 15",
      solution: "total = 0\nfor i in range(1, 6):\n    total += i",
      difficulty: "medium",
      topic: "Loops"
    },
    {
      id: 44,
      level: 5,
      title: "While Loop",
      description: "Use a while loop to count from 1 to 5. Store the final count in a variable `count`.",
      starterCode: "# Your code here\n",
      testCase: "count == 5",
      solution: "count = 0\nwhile count < 5:\n    count += 1",
      difficulty: "medium",
      topic: "Loops"
    },
    {
      id: 45,
      level: 5,
      title: "List Comprehension - Filter",
      description: "Create a variable `numbers = [1, 2, 3, 4, 5, 6]`. Create a variable `evens` with only even numbers using list comprehension.",
      starterCode: "numbers = [1, 2, 3, 4, 5, 6]\n# Your code here\n",
      testCase: "len(evens) == 3",
      solution: "evens = [n for n in numbers if n % 2 == 0]",
      difficulty: "medium",
      topic: "Lists"
    },
    {
      id: 46,
      level: 5,
      title: "List Comprehension - Map",
      description: "Create a variable `numbers = [1, 2, 3, 4, 5]`. Create a variable `doubled` that doubles each number using list comprehension.",
      starterCode: "numbers = [1, 2, 3, 4, 5]\n# Your code here\n",
      testCase: "doubled[0] == 2",
      solution: "doubled = [n * 2 for n in numbers]",
      difficulty: "medium",
      topic: "Lists"
    },
    {
      id: 47,
      level: 5,
      title: "Sum Function",
      description: "Create a variable `numbers = [1, 2, 3, 4, 5]`. Create a variable `total` using the sum() function.",
      starterCode: "numbers = [1, 2, 3, 4, 5]\n# Your code here\n",
      testCase: "total == 15",
      solution: "total = sum(numbers)",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 48,
      level: 5,
      title: "Find Maximum",
      description: "Create a variable `numbers = [3, 7, 2, 9, 1]`. Create a variable `maximum` that stores the largest number.",
      starterCode: "numbers = [3, 7, 2, 9, 1]\n# Your code here\n",
      testCase: "maximum == 9",
      solution: "maximum = max(numbers)",
      difficulty: "easy",
      topic: "Lists"
    },
    {
      id: 49,
      level: 5,
      title: "String Split",
      description: "Create a variable `text = 'Hello World'`. Create a variable `words` that splits it into a list.",
      starterCode: "text = 'Hello World'\n# Your code here\n",
      testCase: "len(words) == 2",
      solution: "words = text.split()",
      difficulty: "easy",
      topic: "Strings"
    },
    {
      id: 50,
      level: 5,
      title: "F-String Formatting",
      description: "Create variables `name = 'John'` and `age = 25`. Create a variable `message` using f-string: 'My name is John and I am 25'.",
      starterCode: "name = 'John'\nage = 25\n# Your code here\n",
      testCase: "message == 'My name is John and I am 25'",
      solution: "message = f'My name is {name} and I am {age}'",
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
