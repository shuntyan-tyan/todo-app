// 1. 裏方の仕組み（sw.js）を登録する
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => {
      console.log('裏方の登録に成功しました！');
    })
    .catch((error) => {
      console.log('登録エラー:', error);
    });
}

// 2. 「通知をオンにする」ボタンを押したときの処理
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        alert('✅ 通知が許可されました！これで準備完了です。');
      } else if (permission === 'denied') {
        alert('❌ 通知が拒否されています。iPhoneの設定アプリから通知を許可してください。');
      }
    });
  } else {
    alert('このブラウザは通知に対応していません。');
  }
}

// 3. 「タスクを追加」ボタンを押したときの処理
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const timeInput = document.getElementById('timeInput');
  const taskList = document.getElementById('taskList');
  
  const taskText = taskInput.value;
  const timeValue = timeInput.value;

  if (!taskText || !timeValue) {
    alert('やることと時間の両方を入力してください！');
    return;
  }

  const targetTime = new Date(timeValue).getTime();
  const now = new Date().getTime();
  const timeToWait = targetTime - now;

  if (timeToWait <= 0) {
    alert('未来の時間を設定してください！');
    return;
  }

  // 画面のタスク一覧に新しいカードを追加する
  const li = document.createElement('li');
  li.className = 'task-item';
  
  // 日時の見た目を綺麗に整える（例：2026/09/23 21:00）
  const displayTime = new Date(timeValue).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  li.innerHTML = `
    <div class="task-info">
      <span class="task-title">📌 ${taskText}</span>
      <span class="task-time">⏰ ${displayTime} に通知</span>
    </div>
  `;
  taskList.appendChild(li);

  // 裏方の仕組み（sw.js）へ通知を依頼する
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.active) {
        registration.active.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          title: '⏰ ToDoリマインダー',
          body: taskText,
          delay: timeToWait
        });
        alert('タスクを一覧に追加し、通知をセットしました！');
      }
    });
  }

  // 入力欄をクリアする
  taskInput.value = '';
  timeInput.value = '';
}