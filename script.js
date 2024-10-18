let generatedExpressions = [];
let generatedResults = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumber(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return getRandomInt(min, max);
}

function downloadFile(content, fileName) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

function generateExpressions() {
  const inputCount = document.getElementById("inputNumber").value;
  const inputStructure = document.getElementById("inputStructure").value;
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  const count = parseInt(inputCount);

  if (!count || count <= 0 || !inputStructure) {
    outputDiv.innerHTML =
      "Please enter a valid number and expression structure.";
    return;
  }

  generatedExpressions = [];
  generatedResults = [];

  let displayContent = "";

  for (let i = 1; i <= count; i++) {
    let expression = inputStructure;

    expression = expression.replace(
      /(\d+)([*+-/])/g,
      (match, digits, operator) => {
        const num = getRandomNumber(parseInt(digits));
        return `${num}${operator}`;
      }
    );

    expression = expression.replace(/(\d+)$/, (match, digits) => {
      return getRandomNumber(parseInt(digits));
    });

    let result;
    try {
      result = eval(expression);
    } catch (error) {
      result = "Error in expression";
    }

    generatedExpressions.push(expression);
    generatedResults.push(result);
    displayContent += `<div>${i}. ${expression}</div>`;
  }

  outputDiv.innerHTML = displayContent;
  document.getElementById("showAnswersBtn").style.display = "inline";
  document.getElementById("download-options").style.display = "block";
}

function showAnswers() {
  const correctAnswersOutput = document.getElementById("correctAnswersOutput");
  correctAnswersOutput.innerHTML = "";

  let answersContent = "";

  for (let i = 0; i < generatedExpressions.length; i++) {
    answersContent += `${i + 1}. ${generatedExpressions[i]} = ${
      generatedResults[i]
    }\n`;
  }

  correctAnswersOutput.innerHTML = answersContent;
  document.getElementById("answers-section").style.display = "block";
}

function downloadFiles() {
  const includeAnswers = document.getElementById("includeAnswers").checked;

  if (includeAnswers) {
    const answersWithResults = generatedExpressions
      .map(
        (expr, index) => `${index + 1}. ${expr} = ${generatedResults[index]}`
      )
      .join("\n");
    downloadFile(answersWithResults, "correct_answers.txt");
  }

  const answersWithoutResults = generatedExpressions.join("\n");
  downloadFile(answersWithoutResults, "no_answer.txt");
}
