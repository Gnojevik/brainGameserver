
// setInterval(time, 1000);

let fn = "";
let ln = "";

let count = 0;
let lvl = 11;
let total = 0;
let start = document.getElementById('start');

start.addEventListener('click', goGame);

bestTotal();

function timer() {
   document.body.onselectstart = function () { return false };
   document.body.onmousedown = function () { return false };
   let seconds = 3;
   setTimeout(function () {
      let str = "";
      let timerHtml = document.getElementsByClassName('timer');
      if (seconds - count < 10) {
         str = `<p style="color: rgb(233, 7, 25);
         background-color: rgb(83, 165, 42);
         border-radius: 5px;
      "> 0${seconds - count} </p>`;

      } else {
         str = `<p> ${seconds - count} </p>`;
      }

      timerHtml[0].innerHTML = str;
      if (count !== seconds) {
         timer();
      } else {
         let answer = document.getElementById('answer');
         let que = document.getElementById('question');
         str = `<button id="start" class="button">START</button>`;
         timerHtml[0].innerHTML = str;
         que.innerText = `DONE`;
         answer.innerHTML = '';
         start = document.getElementById('start');
         start.addEventListener('click', goGame);
         count = 0;
         document.body.onselectstart = function () { return true };
         document.body.onmousedown = function () { return true };
         sendToServer();

      }
      count++;

   }, 1000);


}


function quest(lvl) {
   let totalCount = document.getElementById('total');
   let que = document.getElementById('question');
   let answer = document.getElementById('answer');
   let a = Math.floor(Math.random() * lvl) + 1;
   let b = Math.floor(Math.random() * lvl) + 1;
   let min = (a >= b) ? b : a;
   let order1 = Math.floor(Math.random() * 2) + 1;
   let order2 = (order1 > 1) ? 1 : 2;
   que.innerText = `${a}+${b}=?`;
   answer.innerHTML = `<button id="buttonTrue" class="button" style="order:${order1};">${a + b}</button>
   <button id="buttonFalse" class="button" style="order:${order2} ">${randomArr()}</button>`;
   totalCount.innerText = `score: ${total}`;
   trueOrFalse();
   function randomArr() {
      let random = Math.floor(Math.random() * (a + b)) + min;
      while (random === a + b) {
         random = Math.floor(Math.random() * (a + b)) + min;
      }
      return random;
   }


}

function trueOrFalse() {
   let totalCount = document.getElementById('total');
   let buttonTrue = document.getElementById('buttonTrue');
   let buttonFalse = document.getElementById('buttonFalse');
   buttonTrue.addEventListener('click', () => { total += 3; totalCount.style.color = "rgb(83, 165, 42)"; quest(lvl); });
   buttonFalse.addEventListener('click', () => { total -= 5; totalCount.style.color = "red"; quest(lvl); });
}

function goGame() {
   let formHtml = document.getElementsByClassName('form-server');
   if (formHtml[0] !== undefined) {
      formHtml[0].style.display = 'none';
   }
   total = 0;
   timer();
   quest(lvl);
   bestTotal();

}

function sendToServer() {
   let bTotal = document.getElementById('best-total');
   if (Number(bTotal.textContent) < total) {
      let formHtml = document.getElementsByClassName('form-server');
      formHtml[0].style.display = 'flex';
      let sendButton = document.getElementById('send-serv');
      let fnameInput = document.getElementById('fname');
      let lnameInput = document.getElementById('lname');

      fn = fnameInput.value;
      ln = lnameInput.value;

      sendButton.addEventListener('click', send);
   }

}

async function send() {

   if (fn.length === 0 || ln.length === 0) {
      alert("Enter Name and Last Name");
   } else {
      let user = {
         fname: fn,
         lname: ln,
         score: total
      };

      let response = await fetch('http://localhost:3000/users/cool/', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json;charset=utf-8'
         },
         body: JSON.stringify(user)
      });


      let result = await response.json();
      console.log(`User: ${result.fname} ${result.lname} Score: ${result.score}`);
      console.log(`Best Score: ${result.totalScore}`);
      bestTotal();
   }
}

async function bestTotal() {
   let bTotal = document.getElementById('best-total');
   let bFname = document.getElementById('best-fname');
   let bLname = document.getElementById('best-lname');

   let response = await fetch('http://localhost:3000/users/cool/');

   if (response.ok) { // если HTTP-статус в диапазоне 200-299

      let json = await response.json();
      bTotal.innerText = json.totalScore;
      bFname.innerText = json.fname;
      bLname.innerText = json.lname;

   } else {
      alert("Помилка HTTP: " + response.status);
   }
}