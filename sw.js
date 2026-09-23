// アプリが閉じられていても裏で動く処理（Service Worker）

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay } = event.data;

    // 指定された時間（ミリ秒）が経過するまで待つ
    setTimeout(() => {
      // 時間になったらiPhoneに通知を届ける
      self.registration.showNotification(title, {
        body: body,
        icon: 'icon.png'
      });
    }, delay);
  }
});