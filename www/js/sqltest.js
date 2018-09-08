var js_sqltest = {
    init : function(page) {
        var db = null;  // DBコネクション保持用

        // DBコネクションを取得
        db = window.sqlitePlugin.openDatabase({
            name     : 'todolist.db',
            location : 'default',
        })

        console.log(db);
    },
};