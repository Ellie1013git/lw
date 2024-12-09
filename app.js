// HTML 요소 가져오기
const foodNameInput = document.getElementById("foodName");
const caloriesInput = document.getElementById("calories");
const addButton = document.getElementById("addButton");
const foodList = document.getElementById("foodList");
const totalCaloriesDisplay = document.getElementById("totalCalories");
const calendarTable = document.getElementById("calendarTable");
const calendarTitle = document.getElementById("calendarTitle");

// 총 칼로리 변수
let totalCalories = 0;

// 날짜별 식단을 저장하기 위한 객체
let dietData = {};

// 현재 월과 연도를 관리하는 변수
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// 초기화: 로컬 스토리지에서 데이터 로드
function init() {
   const savedData = JSON.parse(localStorage.getItem("dietData")) || {};
   dietData = savedData;

   // 달력 표 생성
   createCalendar(currentYear, currentMonth);

   // 현재 월을 제목에 반영
   updateCalendarTitle();

   // 오늘 날짜의 식단을 불러옴
   const today = new Date().toISOString().split("T")[0].slice(0, 7); // yyyy-mm
   loadDietForDate(today);
}

// 달력 생성
function createCalendar(year, month) {
   // 첫 번째 날과 마지막 날 계산
   const firstDay = new Date(year, month, 1);
   const lastDay = new Date(year, month + 1, 0);

   const firstDayOfWeek = firstDay.getDay();
   const daysInMonth = lastDay.getDate();

   // 달력 표 초기화
   calendarTable.innerHTML = "";

   // 요일 제목 추가
   const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
   const headerRow = document.createElement("tr");
   weekdays.forEach((day) => {
      const th = document.createElement("th");
      th.textContent = day;
      headerRow.appendChild(th);
   });
   calendarTable.appendChild(headerRow);

   // 날짜 표 생성
   let row = document.createElement("tr");
   let dayCounter = 1;

   // 첫 번째 주의 빈 공간 추가
   for (let i = 0; i < firstDayOfWeek; i++) {
      const td = document.createElement("td");
      row.appendChild(td);
   }

   // 각 날짜 추가
   for (let i = firstDayOfWeek; i < 7; i++) {
      const td = document.createElement("td");
      td.textContent = dayCounter;
      td.addEventListener("click", () => {
         const date = `${year}-${month + 1}-${
            dayCounter < 10 ? "0" : ""
         }${dayCounter}`;
         loadDietForDate(date);
      });
      row.appendChild(td);
      dayCounter++;
   }
   calendarTable.appendChild(row);

   // 나머지 주의 날짜 추가
   while (dayCounter <= daysInMonth) {
      row = document.createElement("tr");
      for (let i = 0; i < 7; i++) {
         if (dayCounter > daysInMonth) break;

         const td = document.createElement("td");
         td.textContent = dayCounter;
         td.addEventListener("click", () => {
            const date = `${year}-${month + 1}-${
               dayCounter < 10 ? "0" : ""
            }${dayCounter}`;
            loadDietForDate(date);
         });
         row.appendChild(td);
         dayCounter++;
      }
      calendarTable.appendChild(row);
   }
}

// 달력 제목 업데이트
function updateCalendarTitle() {
   const monthNames = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
   ];
   calendarTitle.textContent = `${currentYear}년 ${monthNames[currentMonth]}`;
}

// 특정 날짜의 식단 불러오기
function loadDietForDate(date) {
   const dietForDate = dietData[date] || [];

   // 식단 목록 초기화
   foodList.innerHTML = "";
   totalCalories = 0;

   // 해당 날짜의 식단을 목록에 추가
   dietForDate.forEach((item) => {
      addFoodToList(item.name, item.calories, false);
   });

   updateTotalCalories();
}

// 총 칼로리 업데이트
function updateTotalCalories() {
   totalCaloriesDisplay.textContent = totalCalories;
}

// 식단 항목 추가
function addFoodToList(name, calories, save = true) {
   const li = document.createElement("li");
   li.innerHTML = `${name} - ${calories} kcal <button class="deleteButton">삭제</button>`;

   li.querySelector(".deleteButton").addEventListener("click", () => {
      foodList.removeChild(li);
      totalCalories -= calories;
      updateTotalCalories();
      const date =
         calendarTitle.textContent.split(" ")[0] + "-" + (currentMonth + 1);
      const dateDiet = dietData[date] || [];
      dietData[date] = dateDiet.filter(
         (item) => item.name !== name || item.calories !== calories
      );
      if (save) saveToLocalStorage();
   });

   foodList.appendChild(li);
   totalCalories += calories;
   updateTotalCalories();

   if (save) saveToLocalStorage();
}

// 입력 검증 및 식단 추가
addButton.addEventListener("click", () => {
   const name = foodNameInput.value.trim();
   const calories = parseInt(caloriesInput.value.trim(), 10);

   if (!name || isNaN(calories) || calories <= 0) {
      alert("올바른 음식 이름과 칼로리를 입력하세요.");
      return;
   }

   const date = `${currentYear}-${currentMonth + 1}-${new Date().getDate()}`;
   if (!dietData[date]) {
      dietData[date] = [];
   }

   dietData[date].push({ name, calories });
   addFoodToList(name, calories);

   foodNameInput.value = "";
   caloriesInput.value = "";
});

// 로컬 스토리지 저장
function saveToLocalStorage() {
   localStorage.setItem("dietData", JSON.stringify(dietData));
}

// 초기화 실행
init();
