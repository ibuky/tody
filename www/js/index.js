// アプリ起動時に一度のみ実行
document.addEventListener('deviceready', function(event) {
    createTable();  // テーブルを作成する(テーブルが既に存在している場合何もしない)
});

// 各ページの初期表示
document.addEventListener('init', function(event) {
    // 表示対象のページを取得
    var page = event.target;
    
    if (page.id === 'list.html') {
        js_list.init(page);
    }
});

/**
 * テーブルを作成します。
 */
function createTable() {
    // DBコネクションを取得
    db = window.sqlitePlugin.openDatabase({
        name     : 'todolist.db',
        location : 'default',
    });

    var sql = {
            create_table :
                  "CREATE TABLE IF NOT EXISTS todo ( "
                + "    id          INTEGER PRIMARY KEY,"    // ID
                + "    valid       TEXT    NOT NULL,"       // 有効フラグ
                + "    title       TEXT    NOT NULL,"       // タイトル
                + "    date        TEXT    NOT NULL"        // 登録日時
                + ")",

            drop_table :
                "DROP TABLE IF EXISTS todo",
        }
    
    // SQL(CREATE TABLE, INSERT)を実行
    db.transaction(function(tx) {
        // 実行部分
        tx.executeSql(sql.create_table);

    }, function(error) {
        // SQL処理エラー発生時の処理
        console.log('テーブル初期化失敗 : ' + error.message);

    }, function() {
        // SQL処理成功時
        console.log('テーブル初期化成功');
    });
}