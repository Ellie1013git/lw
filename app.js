// HTML 요소 가져오기
const foodNameInput = document.getElementById('foodName');
const caloriesInput = document.getElementById('calories');
const addButton = document.getElementById('addButton');
const foodList = document.getElementById('foodList');
const totalCaloriesDisplay = document.getElementById('totalCalories');

// 총 칼로리 변수
let totalCalories = 0;

// 초기화: 로컬 스토리지에서 데이터 로드
function init() {
  const savedData = JSON.parse(localStorage.getItem('dietList')) || [];
  savedData.forEach((item) => {
    addFoodToList(item.name, item.calories, false);
    totalCalories += item.calories;
  });
  updateTotalCalories();
}

// 총 칼로리 업데이트
function updateTotalCalories() {
  totalCaloriesDisplay.textContent = totalCalories;
}

// 식단 항목 추가
function addFoodToList(name, calories, save = true) {
  // 새로운 li 요소 생성
  const li = document.createElement('li');
  li.innerHTML = `
    ${name} - ${calories} kcal
    <button class="deleteButton">삭제</button>
  `;

  // 삭제 버튼 이벤트 추가
  li.querySelector('.deleteButton').addEventListener('click', () => {
    foodList.removeChild(li);
    totalCalories -= calories;
    updateTotalCalories();
    if (save) saveToLocalStorage();
  });

  // 목록에 추가
  foodList.appendChild(li);

  // 총 칼로리 계산
  totalCalories += calories;
  updateTotalCalories();

  // 로컬 스토리지 저장
  if (save) saveToLocalStorage();
}

// 입력 검증 및 식단 추가
addButton.addEventListener('click', () => {
  const name = foodNameInput.value.trim();
  const calories = parseInt(caloriesInput.value.trim(), 10);

  if (!name || isNaN(calories) || calories <= 0) {
    alert('올바른 음식 이름과 칼로리를 입력하세요.');
    return;
  }

  addFoodToList(name, calories);

  // 입력 필드 초기화
  foodNameInput.value = '';
  caloriesInput.value = '';
});

// 로컬 스토리지 저장
function saveToLocalStorage() {
  const data = [];
  foodList.querySelectorAll('li').forEach((li) => {
    const [name, caloriesText] = li.textContent.split(' - ');
    const calories = parseInt(caloriesText.replace('kcal', '').trim(), 10);
    data.push({ name: name.trim(), calories });
  });
  localStorage.setItem('dietList', JSON.stringify(data));
}

// 초기화 실행
init();
