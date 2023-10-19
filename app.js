// select elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletSpans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let results = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// ### fetch json data and run functions ###
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      // create Bullets + set questions count
      createBullets(qCount);

      // add questions data
      addQuestionData(questionsObject[currentIndex], qCount);

      // start countdown
      countdown(20, qCount);

      /// click on submit
      submitButton.onclick = function () {
        // get right answer
        const rightAnswer = questionsObject[currentIndex].right_answer;

        // increase Index
        currentIndex++;

        //check the answer
        checkAnswer(rightAnswer, qCount);

        // remove previous questions
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // add questions data
        addQuestionData(questionsObject[currentIndex], qCount);

        // handle bullets classes
        handleBullets();

        // start countdown
        clearInterval(countdownInterval);
        countdown(20, qCount);

        // show results
        showResults(qCount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  // create spans
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.className = "on";
    }
    bulletSpans.appendChild(bullet);
  }
}

function addQuestionData(obj, count) {
  console.log(currentIndex, count);
  if (currentIndex < count) {
    // create h2 question title
    let qTitleElement = document.createElement("h2");
    let qTitleText = document.createTextNode(obj.title);
    qTitleElement.appendChild(qTitleText);
    quizArea.appendChild(qTitleElement);
    // create answers options
    for (let i = 1; i <= 4; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");
      mainDiv.className = `answer`;
      // create radio input
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // make first radio input checked
      if (i === 1) {
        radioInput.checked = true;
      }
      // create label
      let answerLabel = document.createElement("label");
      answerLabel.htmlFor = `answer_${i}`;
      let answerText = document.createTextNode(obj[`answer_${i}`]);
      answerLabel.appendChild(answerText);

      // add input and label to the mainDiv then to answer area
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(answerLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (theChoosenAnswer === rAnswer) {
    rightAnswers++;
  }
  console.log(rightAnswers);
}

function handleBullets() {
  let bullets = document.querySelectorAll(".bullets span");
  let arrayOfSpans = Array.from(bullets);

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;

  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class=good>good</span> you answered ${rightAnswers} from ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class=perfect>Exelant</span> you answered ${rightAnswers} from ${count}`;
    } else if (rightAnswers < count / 2) {
      theResults = `<span class=bad>fail</span> ${rightAnswers}/${count} <br>  <i style="font-size:12px">you shoud answer ${parseInt(
        count / 2
      )} from ${count} to pass </i>`;
    }
    results.innerHTML = theResults;
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      countdownElement.textContent = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
