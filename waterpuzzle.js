// 監聽DOM內容載入完成後執行
document.addEventListener("DOMContentLoaded", () => {
  // 取得遊戲區塊、按鈕、關卡選擇元素
  const gameContainer = document.getElementById("game-container");
  const playButton = document.getElementById("play-button");
  const levelSelect = document.getElementById("level-select");

  // 可用的顏色陣列
  const colors = [
    "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown",
    "cyan", "magenta", "lime", "teal", "indigo", "violet", "gold", "silver",
    "maroon", "navy", "olive", "coral",
  ];
  
  // 存放所有試管
  const tubes = [];
  
  // 存放使用者選擇的試管
  let selectedTube = null;
  
  // 記錄當前關卡
  let levelCount = 1;

  // 選擇關卡並更新顯示
  function chooseLevel(level) {
    levelCount = level;
    document.getElementById("level-count").textContent = levelCount;
  }

  // 監聽關卡選擇變化，更新關卡數量
  levelSelect.addEventListener("change", (event) => {
    const selectedLevel = parseInt(event.target.value, 10);
    chooseLevel(selectedLevel);
  });

  // 檢查遊戲狀態，判斷是否完成
  function checkGameState() {
    // 判斷某個試管是否已完成（試管內的所有水都是同一種顏色）
    const allSameColor = (tube) => {
      const waters = Array.from(tube.children);
      return (
        waters.length === 4 &&
        waters.every((water) => water.style.backgroundColor === waters[0].style.backgroundColor)
      );
    };

    // 記錄已完成的試管數量
    let completedTubes = 0;
    tubes.forEach((tube) => {
      if (allSameColor(tube)) {
        completedTubes++;
      }
    });

    // 更新已完成試管的計數
    document.getElementById("completed-tubes-count").textContent = completedTubes;

    // 檢查是否所有試管已完成或是空試管
    if (tubes.every((tube) => tube.childElementCount === 0 || allSameColor(tube))) {
      if (levelCount === 10) {
        alert("恭喜!你已經完成所有挑戰!!");
      } else {
        alert("你已經完成本關卡!");
        levelCount++;
        document.getElementById("level-count").textContent = levelCount;
        document.getElementById("completed-tubes-count").textContent = 0;
        chooseLevel(levelCount);
        createTubes();
        fillTubes();
      }
    }
  }

  // 倒水功能
  function pourWater(fromTube, toTube) {
    let fromWater = fromTube.querySelector(".water:last-child");
    let toWater = toTube.querySelector(".water:last-child");

    // 若目標試管為空，將水倒入
    if (!toWater) {
      const color = fromWater ? fromWater.style.backgroundColor : null;
      while (fromWater && fromWater.style.backgroundColor === color && toTube.childElementCount < 4) {
        toTube.appendChild(fromWater);
        fromWater = fromTube.querySelector(".water:last-child");
      }
    } else {
      while (fromWater && fromWater.style.backgroundColor === toWater.style.backgroundColor && toTube.childElementCount < 4) {
        toTube.appendChild(fromWater);
        fromWater = fromTube.querySelector(".water:last-child");
        toWater = toTube.querySelector(".water:last-child");
      }
    }
    checkGameState();
  }

  // 試管點擊選擇邏輯
  function selectTube(tube) {
    if (selectedTube) {
      if (selectedTube !== tube) {
        pourWater(selectedTube, tube);
      }
      selectedTube.classList.remove("selected");
      selectedTube = null;
    } else {
      selectedTube = tube;
      tube.classList.add("selected");
    }
  }

  // 創建試管
  function createTubes() {
    gameContainer.innerHTML = "";
    tubes.length = 0;

    // 創建與關卡數相符的試管
    for (let i = 0; i < levelCount + 1; i++) {
      const tube = document.createElement("div");
      tube.classList.add("tube");
      tube.addEventListener("click", () => selectTube(tube));
      gameContainer.appendChild(tube);
      tubes.push(tube);
    }

    // 新增兩個額外試管作為緩衝區
    for (let i = 0; i < 2; i++) {
      const emptyTube = document.createElement("div");
      emptyTube.classList.add("tube");
      emptyTube.addEventListener("click", () => selectTube(emptyTube));
      gameContainer.appendChild(emptyTube);
      tubes.push(emptyTube);
    }
  }

  // 填充試管顏色
  function fillTubes() {
    const gameColors = colors.slice(0, Math.min(levelCount + 1, colors.length));
    const waterBlocks = [];

    // 為每個顏色創建四個水塊
    gameColors.forEach((color) => {
      for (let i = 0; i < 4; i++) {
        waterBlocks.push(color);
      }
    });

    // 打亂顏色順序
    waterBlocks.sort(() => 0.5 - Math.random());

    // 分配顏色至試管
    let blockIndex = 0;
    tubes.slice(0, levelCount + 1).forEach((tube) => {
      for (let i = 0; i < 4; i++) {
        if (blockIndex < waterBlocks.length) {
          const water = document.createElement("div");
          water.classList.add("water");
          water.style.backgroundColor = waterBlocks[blockIndex];
          water.style.height = "20%";
          tube.appendChild(water);
          blockIndex++;
        }
      }
    });
  }

  // 監聽遊戲開始按鈕，重置並開始遊戲
  playButton.addEventListener("click", () => {
    tubes.length = 0;
    createTubes();
    fillTubes();
  });
});
