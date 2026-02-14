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
  ],
  // LEVEL 6: STRING METHODS
  6: [
    {
      id: 51,
      level: 6,
      title: "Replace Substring",
      description: "Create a variable `text = 'I like apples'`. Replace 'apples' with 'bananas' and store in `new_text`.",
      starterCode: "text = 'I like apples'\n",
      testCase: "new_text == 'I like bananas'",
      solution: "new_text = text.replace('apples', 'bananas')",
      difficulty: "easy",
      topic: "String Methods"
    },
    {
      id: 52,
      level: 6,
      title: "Find Position",
      description: "Create a variable `text = 'Python logic'`. Find the index of 'logic' and store it in `pos`.",
      starterCode: "text = 'Python logic'\n",
      testCase: "pos == 7",
      solution: "pos = text.find('logic')",
      difficulty: "easy",
      topic: "String Methods"
    },
    {
      id: 53,
      level: 6,
      title: "Strip Whitespace",
      description: "Create a variable `text = '  clean me  '`. Remove the leading and trailing whitespace and store in `clean`.",
      starterCode: "text = '  clean me  '\n",
      testCase: "clean == 'clean me'",
      solution: "clean = text.strip()",
      difficulty: "easy",
      topic: "String Methods"
    },
    {
      id: 54,
      level: 6,
      title: "Count Occurrences",
      description: "Create a variable `text = 'banana'`. Count how many times 'a' appears and store in `count`.",
      starterCode: "text = 'banana'\n",
      testCase: "count == 3",
      solution: "count = text.count('a')",
      difficulty: "easy",
      topic: "String Methods"
    },
    {
      id: 55,
      level: 6,
      title: "Check Digit",
      description: "Create a variable `val = '123'`. Check if it contains only digits and store in `is_num`.",
      starterCode: "val = '123'\n",
      testCase: "is_num == True",
      solution: "is_num = val.isdigit()",
      difficulty: "easy",
      topic: "String Methods"
    },
    {
      id: 56,
      level: 6,
      title: "Check Start",
      description: "Create a variable `text = 'Hello World'`. Check if it starts with 'Hello' and store in `starts`.",
      starterCode: "text = 'Hello World'\n",
      testCase: "starts == True",
      solution: "starts = text.startswith('Hello')",
      difficulty: "easy",
      topic: "String Methods"
    },
    {
      id: 57,
      level: 6,
      title: "Check End",
      description: "Create a variable `filename = 'data.csv'`. Check if it ends with '.csv' and store in `is_csv`.",
      starterCode: "filename = 'data.csv'\n",
      testCase: "is_csv == True",
      solution: "is_csv = filename.endswith('.csv')",
      difficulty: "easy",
      topic: "String Methods"
    },
    {
      id: 58,
      level: 6,
      title: "Capitalize",
      description: "Create a variable `text = 'python'`. Capitalize only the first letter and store in `proper`.",
      starterCode: "text = 'python'\n",
      testCase: "proper == 'Python'",
      solution: "proper = text.capitalize()",
      difficulty: "easy",
      topic: "String Methods"
    },
    {
      id: 59,
      level: 6,
      title: "Title Case",
      description: "Create a variable `text = 'hello world'`. Change it to title case and store in `titled`.",
      starterCode: "text = 'hello world'\n",
      testCase: "titled == 'Hello World'",
      solution: "titled = text.title()",
      difficulty: "easy",
      topic: "String Methods"
    },
    {
      id: 60,
      level: 6,
      title: "Join Strings",
      description: "Create a list `words = ['a', 'b', 'c']`. Join them with '-' and store in `joined`.",
      starterCode: "words = ['a', 'b', 'c']\n",
      testCase: "joined == 'a-b-c'",
      solution: "joined = '-'.join(words)",
      difficulty: "easy",
      topic: "String Methods"
    }
  ],
  // LEVEL 7: TYPE CONVERSIONS
  7: [
    {
      id: 61,
      level: 7,
      title: "String to Int",
      description: "Convert the string `s = '100'` to an integer and store in `num`.",
      starterCode: "s = '100'\n",
      testCase: "num === 100",
      solution: "num = int(s)",
      difficulty: "easy",
      topic: "Type Conversions"
    },
    {
      id: 62,
      level: 7,
      title: "Int to String",
      description: "Convert the integer `n = 50` to a string and store in `text`.",
      starterCode: "n = 50\n",
      testCase: "text == '50'",
      solution: "text = str(n)",
      difficulty: "easy",
      topic: "Type Conversions"
    },
    {
      id: 63,
      level: 7,
      title: "Float to Int",
      description: "Convert `f = 9.99` to an integer (truncate) and store in `whole`.",
      starterCode: "f = 9.99\n",
      testCase: "whole == 9",
      solution: "whole = int(f)",
      difficulty: "easy",
      topic: "Type Conversions"
    },
    {
      id: 64,
      level: 7,
      title: "Int to Float",
      description: "Convert `n = 5` to a float and store in `decimal`.",
      starterCode: "n = 5\n",
      testCase: "decimal == 5.0",
      solution: "decimal = float(n)",
      difficulty: "easy",
      topic: "Type Conversions"
    },
    {
      id: 65,
      level: 7,
      title: "List to Tuple",
      description: "Convert `l = [1, 2, 3]` to a tuple and store in `t`.",
      starterCode: "l = [1, 2, 3]\n",
      testCase: "type(t) == tuple",
      solution: "t = tuple(l)",
      difficulty: "easy",
      topic: "Type Conversions"
    },
    {
      id: 66,
      level: 7,
      title: "Tuple to List",
      description: "Convert `t = (4, 5, 6)` to a list and store in `l`.",
      starterCode: "t = (4, 5, 6)\n",
      testCase: "type(l) == list",
      solution: "l = list(t)",
      difficulty: "easy",
      topic: "Type Conversions"
    },
    {
      id: 67,
      level: 7,
      title: "List to Set",
      description: "Convert `l = [1, 2, 2, 3]` to a set to remove duplicates and store in `s`.",
      starterCode: "l = [1, 2, 2, 3]\n",
      testCase: "len(s) == 3",
      solution: "s = set(l)",
      difficulty: "easy",
      topic: "Type Conversions"
    },
    {
      id: 68,
      level: 7,
      title: "Char to Ordinal",
      description: "Get the ASCII value of character `c = 'A'` and store in `code`.",
      starterCode: "c = 'A'\n",
      testCase: "code == 65",
      solution: "code = ord(c)",
      difficulty: "easy",
      topic: "Type Conversions"
    },
    {
      id: 69,
      level: 7,
      title: "Ordinal to Char",
      description: "Get the character for ASCII value `code = 97` and store in `char`.",
      starterCode: "code = 97\n",
      testCase: "char == 'a'",
      solution: "char = chr(code)",
      difficulty: "easy",
      topic: "Type Conversions"
    },
    {
      id: 70,
      level: 7,
      title: "Hexadecimal String",
      description: "Convert `n = 255` to a hexadecimal string and store in `h`.",
      starterCode: "n = 255\n",
      testCase: "h == '0xff'",
      solution: "h = hex(n)",
      difficulty: "easy",
      topic: "Type Conversions"
    }
  ],
  // LEVEL 8: LIST METHODS (Advanced)
  8: [
    {
      id: 71,
      level: 8,
      title: "Insert at Index",
      description: "Create `l = [1, 3]`. Insert number 2 at index 1.",
      starterCode: "l = [1, 3]\n",
      testCase: "l[1] == 2",
      solution: "l.insert(1, 2)",
      difficulty: "easy",
      topic: "List Methods"
    },
    {
      id: 72,
      level: 8,
      title: "Remove by Value",
      description: "Create `l = ['a', 'b', 'c']`. Remove 'b' from the list.",
      starterCode: "l = ['a', 'b', 'c']\n",
      testCase: "'b' not in l",
      solution: "l.remove('b')",
      difficulty: "easy",
      topic: "List Methods"
    },
    {
      id: 73,
      level: 8,
      title: "Clear List",
      description: "Create `l = [1, 2, 3]`. Remove all elements from the list.",
      starterCode: "l = [1, 2, 3]\n",
      testCase: "len(l) == 0",
      solution: "l.clear()",
      difficulty: "easy",
      topic: "List Methods"
    },
    {
      id: 74,
      level: 8,
      title: "Find Index",
      description: "Create `l = [10, 20, 30]`. Find the index of 20 and store in `idx`.",
      starterCode: "l = [10, 20, 30]\n",
      testCase: "idx == 1",
      solution: "idx = l.index(20)",
      difficulty: "easy",
      topic: "List Methods"
    },
    {
      id: 75,
      level: 8,
      title: "Count Values",
      description: "Create `l = [1, 2, 2, 3, 2]`. Count how many 2s are in the list and store in `cnt`.",
      starterCode: "l = [1, 2, 2, 3, 2]\n",
      testCase: "cnt == 3",
      solution: "cnt = l.count(2)",
      difficulty: "easy",
      topic: "List Methods"
    },
    {
      id: 76,
      level: 8,
      title: "Sort List",
      description: "Create `l = [3, 1, 4, 2]`. Sort the list in ascending order.",
      starterCode: "l = [3, 1, 4, 2]\n",
      testCase: "l == [1, 2, 3, 4]",
      solution: "l.sort()",
      difficulty: "easy",
      topic: "List Methods"
    },
    {
      id: 77,
      level: 8,
      title: "Reverse Sort",
      description: "Create `l = [1, 2, 3]`. Sort the list in descending order.",
      starterCode: "l = [1, 2, 3]\n",
      testCase: "l == [3, 2, 1]",
      solution: "l.sort(reverse=True)",
      difficulty: "medium",
      topic: "List Methods"
    },
    {
      id: 78,
      level: 8,
      title: "Extend List",
      description: "Create `l1 = [1, 2]` and `l2 = [3, 4]`. Extend `l1` with `l2`.",
      starterCode: "l1 = [1, 2]\nl2 = [3, 4]\n",
      testCase: "len(l1) == 4",
      solution: "l1.extend(l2)",
      difficulty: "easy",
      topic: "List Methods"
    },
    {
      id: 79,
      level: 8,
      title: "Copy List",
      description: "Create `l = [1, 2]`. Create a shallow copy named `l_copy` using copy().",
      starterCode: "l = [1, 2]\n",
      testCase: "l_copy == [1, 2] and l_copy is not l",
      solution: "l_copy = l.copy()",
      difficulty: "medium",
      topic: "List Methods"
    },
    {
      id: 80,
      level: 8,
      title: "Reverse Method",
      description: "Create `l = [1, 2, 3]`. Reverse the list in-place using reverse().",
      starterCode: "l = [1, 2, 3]\n",
      testCase: "l[0] == 3",
      solution: "l.reverse()",
      difficulty: "easy",
      topic: "List Methods"
    }
  ],
  // LEVEL 9: FACTORY TYCOON (Word Factory Challenges)
  9: [
    {
      id: 81,
      level: 9,
      title: "The Steam Press",
      description: "Materials are coming in small. Use the Power Press to make them BIG (UPPER CASE).",
      input: "iron_ore",
      expected: "IRON_ORE",
      starterCode: "material = 'iron_ore'\n",
      testCase: "material == 'IRON_ORE'",
      solution: "material = material.upper()",
      topic: "Factory"
    },
    {
      id: 82,
      level: 9,
      title: "Rust Remover",
      description: "The 'X' marks on these crates are rusty. Replace all 'X' with an empty space.",
      input: "CRATEX01",
      expected: "CRATE 01",
      starterCode: "material = 'CRATEX01'\n",
      testCase: "material == 'CRATE 01'",
      solution: "material = material.replace('X', ' ')",
      topic: "Factory"
    },
    {
      id: 83,
      level: 9,
      title: "Conveyor Cleaning",
      description: "Loose dust (spaces) at the ends of our gears. Trim them off!",
      input: "   GEAR_V8   ",
      expected: "GEAR_V8",
      starterCode: "material = '   GEAR_V8   '\n",
      testCase: "material == 'GEAR_V8'",
      solution: "material = material.strip()",
      topic: "Factory"
    },
    {
      id: 84,
      level: 9,
      title: "Label Cutter",
      description: "We only need the first 4 serial codes. Cut the label!",
      input: "BZ99-XP-04",
      expected: "BZ99",
      starterCode: "material = 'BZ99-XP-04'\n",
      testCase: "material == 'BZ99'",
      solution: "material = material[0:4]",
      topic: "Factory"
    },
    {
      id: 85,
      level: 9,
      title: "Quality Stamp",
      description: "Add the '_OK' stamp to the end of every part name.",
      input: "CYLINDER",
      expected: "CYLINDER_OK",
      starterCode: "material = 'CYLINDER'\n",
      testCase: "material == 'CYLINDER_OK'",
      solution: "material = material + '_OK'",
      topic: "Factory"
    },
    {
      id: 86,
      level: 9,
      title: "Metal Melter",
      description: "These parts are too harsh (UPPER). Melt them down to small parts (lower case).",
      input: "TITANIUM",
      expected: "titanium",
      starterCode: "material = 'TITANIUM'\n",
      testCase: "material == 'titanium'",
      solution: "material = material.lower()",
      topic: "Factory"
    },
    {
      id: 87,
      level: 9,
      title: "Gears of Reverse",
      description: "The conveyor is moving backwards! Flip the signal to read it correctly.",
      input: "LANIGIS_TOL",
      expected: "LOT_SIGNAL",
      starterCode: "material = 'LANIGIS_TOL'\n",
      testCase: "material == 'LOT_SIGNAL'",
      solution: "material = material[::-1]",
      topic: "Factory"
    },
    {
      id: 88,
      level: 9,
      title: "Industrial Inventory",
      description: "We need to know how many letters are in this shipment ID.",
      input: "PRODUCTION_LINE_ALPHA",
      expected: "21",
      starterCode: "material = 'PRODUCTION_LINE_ALPHA'\n",
      testCase: "material == '21'",
      solution: "material = str(len(material))",
      topic: "Factory"
    },
    {
      id: 89,
      level: 9,
      title: "Serial Reformatter",
      description: "Change all '_' underscores to '-' dashes for the new system.",
      input: "UNIT_99_TYPE_X",
      expected: "UNIT-99-TYPE-X",
      starterCode: "material = 'UNIT_99_TYPE_X'\n",
      testCase: "material == 'UNIT-99-TYPE-X'",
      solution: "material = material.replace('_', '-')",
      topic: "Factory"
    },
    {
      id: 90,
      level: 9,
      title: "The Factory Master",
      description: "Final Order: Trim spaces, Make it ALL CAPS, and Reverse it!",
      input: "   final_assembly   ",
      expected: "YLBMESSA_LANIF",
      starterCode: "material = '   final_assembly   '\n",
      testCase: "material == 'YLBMESSA_LANIF'",
      solution: "material = material.strip().upper()[::-1]"
    }
  ],
  // LEVEL 10: SPY DECODER (String Missions)
  10: [
    {
      id: 101,
      level: 10,
      title: "Clear the Static",
      description: "The signal has extra spaces at the ends. Trim them off to read the secret.",
      starterCode: "signal = '   SECURE_BASE   '\n",
      testCase: "signal == 'SECURE_BASE'",
      solution: "signal = signal.strip()",
      difficulty: "easy",
      topic: "Spy Decoder"
    },
    {
      id: 102,
      level: 10,
      title: "Uniform Code",
      description: "The password must be in ALL CAPS to pass the firewall.",
      starterCode: "signal = 'password123'\n",
      testCase: "signal == 'PASSWORD123'",
      solution: "signal = signal.upper()",
      difficulty: "easy",
      topic: "Spy Decoder"
    },
    {
      id: 103,
      level: 10,
      title: "Hidden Symbol",
      description: "There is an extra '#' in the coordinates. Replace it with a space.",
      starterCode: "signal = 'Agent#Smith'\n",
      testCase: "signal == 'Agent Smith'",
      solution: "signal = signal.replace('#', ' ')",
      difficulty: "easy",
      topic: "Spy Decoder"
    },
    {
      id: 104,
      level: 10,
      title: "Extract the Key",
      description: "We only need the first 5 characters of this long transmission.",
      starterCode: "signal = 'ALPHA_OMEGA_SECRET'\n",
      testCase: "signal == 'ALPHA'",
      solution: "signal = signal[0:5]",
      difficulty: "medium",
      topic: "Spy Decoder"
    },
    {
      id: 105,
      level: 10,
      title: "Mirror Protocol",
      description: "The intercepted signal is reversed! Flip it back.",
      starterCode: "signal = 'ESAB_ID_MAIP'\n",
      testCase: "signal == 'PIAM_DI_BASE'",
      solution: "signal = signal[::-1]",
      difficulty: "medium",
      topic: "Spy Decoder"
    },
    {
      id: 106,
      level: 10,
      title: "The Secure Bridge",
      description: "Join this fragment with '_ACTIVE' to restore the signal.",
      starterCode: "signal = 'COMMAND'\n",
      testCase: "signal == 'COMMAND_ACTIVE'",
      solution: "signal = signal + '_ACTIVE'",
      difficulty: "easy",
      topic: "Spy Decoder"
    },
    {
      id: 107,
      level: 10,
      title: "Left-Side Leak",
      description: "A specific encryption error added spaces only on the LEFT. Trim them off.",
      starterCode: "signal = '     GHOST_ONE'\n",
      testCase: "signal == 'GHOST_ONE'",
      solution: "signal = signal.lstrip()",
      difficulty: "easy",
      topic: "Spy Decoder"
    },
    {
      id: 108,
      level: 10,
      title: "Official ID",
      description: "Spy aliases must be in 'Title Case' to match the database.",
      starterCode: "signal = 'agent penguin'\n",
      testCase: "signal == 'Agent Penguin'",
      solution: "signal = signal.title()",
      difficulty: "medium",
      topic: "Spy Decoder"
    },
    {
      id: 109,
      level: 10,
      title: "Signal Statistics",
      description: "The firewall needs the length of this signal. Store it back in signal (as a string).",
      starterCode: "signal = 'MISSION_IMPOSSIBLE'\n",
      testCase: "signal == '18'",
      solution: "signal = str(len(signal))",
      difficulty: "hard",
      topic: "Spy Decoder"
    },
    {
      id: 110,
      level: 10,
      title: "The Omega Protocol",
      description: "Final Boss! Lowercase it, remove '#' symbols, and trim all spaces.",
      starterCode: "signal = '  #AGENT_#007#  '\n",
      testCase: "signal == 'agent_007'",
      solution: "signal = signal.lower().replace('#', '').strip()",
      difficulty: "hard",
      topic: "Spy Decoder"
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
