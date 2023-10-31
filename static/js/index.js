let checkAnswerBtn = document.getElementById("check-answer");
let nextBtn = document.getElementById("nextBtn"); 

let n = 0;
let correct = 0;
let wrong = 0;
let current_qtn = 0;
let questionIdx = 0
var test;
let min = 0;
let sec = 0;

//disable Check Anwer button before picking any answer
checkAnswerBtn.disabled = true;


const removeWhiteSpaces = (str) =>str.replace(/\s+/g, '_');

// switches from the finished question to a new one
const change_board = (test)=>{
  let board = document.getElementById("board");
  let new_boad = document.createElement("div")
  new_boad.innerHTML = `
  <div id="question">${test[questionIdx].question}</div>
  <br>
  <input type="radio" id="option1" name="opt" value=${removeWhiteSpaces(test[questionIdx].optn1)}>
  <label for="option1">${test[questionIdx].optn1}</label>
  <br>
  <input type="radio" id="option2" name="opt" value=${removeWhiteSpaces(test[questionIdx].optn2)}>
  <label for="option2">${test[questionIdx].optn2}</label>
  <br>
  <input type="radio" id="option3" name="opt" value=${removeWhiteSpaces(test[questionIdx].optn3)}>
  <label for="option3">${test[questionIdx].optn3}</label>
  <br>
  <input type="radio" id="option4" name="opt" value=${removeWhiteSpaces(test[questionIdx].optn4)}>
  <label for="option4">${test[questionIdx].optn4}</label>
  `;
  new_boad.id = "board";
  document.body.replaceChild(new_boad,board);
  document.getElementById("out-of").innerText = `${questionIdx+1}/${test.length} questions`
}

// Checks if the selected answer is correct or not
const checkIsCorrect = (answer) => {
  let selectedValue =document.querySelector('input[name="opt"]:checked').value;
  if (selectedValue === answer){
    document.querySelector(`input[value="${answer}"]`).nextSibling.nextSibling.style.backgroundColor = "#59f179"
    correct++;
    update_correct_wrong();
  }
  else{
    document.querySelector(`input[value="${selectedValue}"]`).nextSibling.nextSibling.style.backgroundColor = "#f13959"
    document.querySelector(`input[value="${answer}"]`).nextSibling.nextSibling.style.backgroundColor = "#59f179"
    wrong++;
    update_correct_wrong();
  }
}

// updates the number of both correct and wrong answers
const update_correct_wrong = ()=>{
  document.getElementById("correct").innerText = `Correct: ${correct}`;
  document.getElementById("wrong").innerText = `Wrong: ${wrong}`;
}

// listens on all the given  options (answers)
// if any of them is selected it activates the "Check Answer" button
document.body.addEventListener("input",()=>{
  checkAnswerBtn.disabled = false;
})

const showScoreReport = () =>{
  document.getElementById("board").style.display = "none";
  document.querySelector(".header").style.display = "none";
  document.getElementById("btns").style.display = "none";

  let scoreDiv = document.getElementById("score");
  scoreDiv.style.display = "block";
  scoreDiv.innerHTML = `
   <u><h1 anlign="center">**THE REPORT**</h1></u>
    <h3>questions solved : ${questionIdx+1}</h3>
    <h3>corrects : ${correct}</h3>
    <h3>wrongs : ${wrong}</h3>
    <h3>score : ${(correct*100)/(questionIdx+1)}%</>
    <h3>Time took : ${min} minute(s) and ${sec} second(s)</h3>
  `;
}

//fetch question from the backend
fetch('/get-questions')
  .then(response => response.json())
  .then(data => {

    //convert json to a javascript object
    test = JSON.parse(data);

    // it runs the "change_board" function so that the first question is displayed 
    change_board(test);

    // listens on the "Check Answer" button 
    // if it's or not clicked inorder to submit to answer
    checkAnswerBtn.addEventListener("click",() =>{
      if (questionIdx == test.length-1){
        nextBtn.innerText = "View Report"    
      }
      nextBtn.style.display = "inline-block";
      checkAnswerBtn.replaceWith(nextBtn)
      checkIsCorrect(removeWhiteSpaces(test[questionIdx].answer));
      questionIdx++;
    })

    // listens on the "Next" button inorder to switch to a new question
    nextBtn.addEventListener("click",() =>{
      try {
        change_board(test)
        checkAnswerBtn.disabled = true;
        nextBtn.replaceWith(checkAnswerBtn);
        
      } catch (error) {
        showScoreReport();
        //document.body.innerText = "OVER"
      }
    })
})

setInterval(()=>{
  console.log(`${min} : ${sec}`)
  if (sec === 59){
    min++;
    sec = 0;
  }
  else{
    sec++;
  }
},1000)
