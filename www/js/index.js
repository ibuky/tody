document.addEventListener('init', function(event) {
    // 表示対象のページを取得
    var page = event.target;
    
    // 存在していなければテーブルを作成
    // createTable();

    // button.htmlページの処理
    if (page.id === 'button.html') {

    } else if (page.id === 'list.html') {
        js_list.init(page);
    
    } else if (page.id === 'sqltest.html') {
        js_sqltest.init(page);
        
    } else if (page.id === 'register.html') {
        js_register.init(page);
        
    }
});

document.addEventListener('deviceready', function(event) {
    createTable();
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
                + "    detail      TEXT,"                   // 詳細情報
                + "    important   TEXT    NOT NULL,"       // 重要フラグ
                + "    urgent      TEXT    NOT NULL,"       // 緊急フラグ
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

    // SQL(SELECT)を実行
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM todo LIMIT 100', [], function(tx, result) {
            console.log(result.rows);
        })
    })
}