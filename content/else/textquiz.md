# Testquiz

## Single Choice Questions

Only one of the answers is correct. Also this is just a single question.

::question
---

question: "What is a callback function in JavaScript?"
answers: [
  "A function passed into another function as an argument",
  "A function that calls back the operating system",
  "A function that repeats code"
]
explanation: "A callback function is a function passed into another function as an argument. It allows the function to call back the caller when it has completed its task."
correct: 0
---

::

## Multiple Choice Questions

Multiple answers can be correct. This is a quiz with multiple questions.

::quiz

::question
---

question: "What is the output of the following code snippet?"
code: "console.log(1 + '2' + 3 + 4);"
codeLang: "javascript"
answers: [
  "10",
  "16",
  "1234"
]
explanation: "The code snippet converts the number 1 to a string and concatenates it with the string '2'. The result is '12'. The next number 3 is also converted to a string and concatenated with the previous result. The final result is '1234'."
correct: 2
---

::

::question
---

question: "What is NOT the purpose of the 'use strict' directive in JavaScript?"
answers: [
  "It allows the use of new features in JavaScript",
  "It enables strict mode, which catches common coding errors and unsafe actions",
  "It is a comment that has no effect on the code",
    "It is a directive to use the strict equality operator (===)"
]
explanation: "The 'use strict' directive enables strict mode in JavaScript, which catches common coding errors and unsafe actions. It helps to write cleaner and more secure code."
correct: [0, 2, 3]
---

::
::
