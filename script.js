// 画面のパーツを取得（操作する準備）
const taskInput = document.getElementById('task-input');
const taskTime = document.getElementById('task-time');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const notifyBtn = document.getElementById('notify-permission-btn');

// パソコンに保存されているタスクを読み込む（なければ空っぽ）
let tasks = JSON.parse(localStorage.getItem('my_todos')) || [];

// 1. 通知の許可をもらう処理
notifyBtn.addEventListener('click', () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        alert('通知が許可されました！');
      } else {
        alert('通知が拒否されました。ブラウザの設定から変更できます。');
      }
    });
  } else {
    alert('お使いのブラウザは通知機能に対応していません。');
  }
});

// 画面にタスクを表示する関数（命令のセット）
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${task.text} ${task.time ? '(' + task.time.replace('T', ' ') + ')' : ''}</span>
      <button class="delete-btn" onclick="deleteTask(${index})">削除</button>
    `;
    taskList.appendChild(li);

    // 時間が指定されていれば通知をセット
    if (task.time) {
      setNotification(task.text, task.time);
    }
  });
}

// 2. 「追加」ボタンを押したときの処理
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  const time = taskTime.value;

  if (text === '') {
    alert('やることを入力してください！');
    return;
  }

  // 新しいタスクを追加してパソコンに保存
  tasks.push({ text: text, time: time });
  localStorage.setItem('my_todos', JSON.stringify(tasks));

  // 画面を更新して入力欄を空にする
  renderTasks();
  taskInput.value = '';
  taskTime.value = '';
});

// 3. 「削除」ボタンを押したときの処理
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('my_todos', JSON.stringify(tasks));
  renderTasks();
}

// 4. 指定時間になったら通知を出す処理
function setNotification(text, time) {
  const targetTime = new Date(time).getTime();
  const now = new Date().getTime();
  const delay = targetTime - now;

  if (delay > 0) {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('ToDoリマインダー', { body: text });
      } else {
        alert(`【時間です！】${text}`);
      }
    }, delay);
  }
}

// 最後に、最初に画面を開いたときに保存データを表示！
renderTasks();