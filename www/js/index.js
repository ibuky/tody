document.addEventListener('init', function(event) {
    // 表示対象のページを取得
    var page = event.target;

    // button.htmlページの処理
    if (page.id === 'button.html') {
        // button.html内の<ons-button id="button">の要素を取得
        var elem_btn = document.getElementById('button');
        
        // ボタンタッチ時の処理を追加
        elem_btn.addEventListener('click', function() {
            // ポップアップの表示
            ons.notification.alert('ボタンを押しました！');
        });
    }
});