var js_sqltest = {
    init : function(page) {
        var db = null;  // DBコネクション保持用

        // DBコネクションを取得
        db = window.sqlitePlugin.openDatabase({
            name     : 'todolist.db',
            location : 'default',
        })

        console.log(db);

        var sql = {
            create_table :
                  "CREATE TABLE IF NOT EXISTS test ("
                //   カラム名    データ型
                + "  id         INTEGER PRIMARY KEY,"
                + "  text       TEXT"
                + ")",

            drop_table : "DROP TABLE test",

            insert : "INSERT INTO test (text) VALUES (?)",

            select : "SELECT * FROM test",
        }

        // SQL(CREATE TABLE, INSERT)を実行
        db.transaction(function(tx) {
            // 実行部分
            tx.executeSql(sql.create_table);
            // tx.executeSql(sql.insert, ['テスト']);
        }, function(error) {
            // SQL処理エラー発生時の処理
            console.log('エラーが発生しました : ' + error.message);

        }, function() {
            // SQL処理成功時の処理
            console.log('処理成功');
            
        })

        // SQL(SELECT)を実行
        db.transaction(function(tx) {
            tx.executeSql(sql.select, [], function(tx, result) {
                console.log(result.rows.length);
                for (var i = 0; i < result.rows.length; i++) {
                    console.log(result.rows.item(i));
                }
            })
        })
    },
};