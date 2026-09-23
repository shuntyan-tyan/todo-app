// 1. アプリ起動時に「裏方の仕組み（sw.js）」をiPhoneに登録する
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => {
      console.log('裏方の登録に成功しました！');
    })
    .catch((error) => {
      console.log('登録エラー:', error);
    });
}

// 2. 通知の許可を求める関数
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        alert('通知が許可されました！');
      } else {
        alert('通知が拒否されました。設定から許可してください。');
      }
    });
  } else {
    alert('このブラウザは通知に対応していません。');
  }
}

// 3. タスクを追加して通知をセットする関数
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const timeInput = document.getElementById('timeInput');
  const taskText = taskInput.value;
  const targetTime = new Date(timeInput.value).getTime();
  const now = new Date().getTime();
  const timeToWait = targetTime - now;

  if (!taskText || !timeInput.value) {
    alert('タスクと時間を両方入力してください！');
    return;
  }

  if (timeToWait <= 0) {
    alert('未来の時間を設定してください！');
    return;
  }

  // 裏方の仕組み（sw.js）に「時間になったら通知を出して！」と依頼する
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.active) {
        registration.active.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          title: 'ToDoリマインダー',
          body: taskText,
          delay: timeToWait
        });
        alert('タスクを追加し、通知をセットしました！');
      }
    });
  }

  // 入力欄をクリアする
  taskInput.value = '';
  timeInput.value = '';
}