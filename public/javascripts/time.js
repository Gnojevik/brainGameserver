
// setInterval(time, 1000);



let count = 0;
let lvl = 11;
let total = 0;
let start = document.getElementById('start');

start.addEventListener('click', goGame);

bestTotal();

function timer() {
   document.body.onselectstart = function () { return false };
   document.body.onmousedown = function () { return false };
   let seconds = 30;
   setTimeout(function () {
      let str = "";
      let timerHtml = document.getElementsByClassName('timer');
      if (seconds - count < 10) {
         str = `<p class="tablet" style="color: rgb(233, 7, 25);
         background-color: rgb(83, 165, 42);
         border-radius: 5px;
      "> 0${seconds - count} </p>`;

      } else {
         str = `<p class="tablet"> ${seconds - count} </p>`;
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
   buttonTrue.addEventListener('click', () => { total += 3; totalCount.style.color = "aliceblue"; quest(lvl); });
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
      let honor = document.getElementById('honor');
      let sendButton = document.getElementById('send-serv');
      honor.innerHTML = "<p>Congratulations - you are a new champion!!!</p> <p>Save your name on the honor board</p> ";
      sendButton.addEventListener('click', send);
   }

}

async function send() {
   let fnameInput = document.getElementById('fname');
   let lnameInput = document.getElementById('lname');
   if (fnameInput.value.length === 0) {
      alert("Please enter Name");
   } else {
      let user = {
         fname: fnameInput.value,
         lname: lnameInput.value,
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

      let honor = document.getElementById('honor');
      honor.innerHTML = `<p>${result.fname} ${result.lname}</p> <p>Your record: ${result.score} </p> `;
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