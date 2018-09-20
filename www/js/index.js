document.addEventListener('init', function(event) {
    // 表示対象のページを取得
    var page = event.target;
    
    // 存在していなければテーブルを作成
    createTable();

    // button.htmlページの処理
    if (page.id === 'button.html') {

    } else if (page.id === 'list.html') {
        js_list.init(page);
    
    } else if (page.id === 'sqltest.html') {
        js_sqltest.init(page);
        
    }
});

function createTable() {
    console.log('here');
}