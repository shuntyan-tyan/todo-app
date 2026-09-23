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

// 2. 「🔔 通知をオンにする」ボタンを押したときの処理
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        alert('通知が許可されました！');
      } else if (permission === 'denied') {
        alert('通知が拒否されています。スマホの設定から通知を許可してください。');
      } else {
        alert('通知の設定がキャンセルされました。');
      }
    });
  } else {
    alert('このブラウザは通知に対応していません。');
  }
}

// 3. 「追加」ボタンを押したときの処理
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const timeInput = document.getElementById('timeInput');
  
  const taskText = taskInput.value;
  const targetTime = new Date(timeInput.value).getTime();
  const now = new Date().getTime();
  const timeToWait = targetTime - now;

  // 入力チェック
  if (!taskText || !timeInput.value) {
    alert('タスクと時間を両方入力してください！');
    return;
  }

  if (timeToWait <= 0) {
    alert('未来の時間を設定してください！');
    return;
  }

  // 裏方の仕組み（sw.js）へ通知を依頼する
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
      } else {
        alert('裏方の準備がまだできていません。もう一度試してください。');
      }
    }).catch(() => {
      alert('タスクは追加されました（通知のセットに失敗しました）');
    });
  }

  // 入力欄をクリアする
  taskInput.value = '';
  timeInput.value = '';
}