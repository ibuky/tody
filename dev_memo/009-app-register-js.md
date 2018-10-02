# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(9 - 登録画面の作成(JavaScript))

### 前の記事
画面の作成(HTML)

### JavaScript処理の追加
#### 起動時にテーブルを作成
まずはデータを登録するためのテーブルを作成します。

以前ローカルDBについていろいろやりましたが基本は同じです。テーブル項目は入力項目に合うように変更しましょう。

```sql
CREATE TABLE IF NOT EXISTS todo (
    id          INTEGER PRIMARY KEY,    -- ID(主キー)
    valid       TEXT    NOT NULL,       -- 有効フラグ
    title       TEXT    NOT NULL,       -- タイトル
    detail      TEXT,                   -- 詳細情報
    important   TEXT    NOT NULL,       -- 重要フラグ
    urgent      TEXT    NOT NULL,       -- 緊急フラグ
    date        TEXT    NOT NULL        -- 登録日時
);
```

これらのカラムを持ったデータベースを使用します。
テーブルの作成は、アプリ起動時の一回だけでいいので**アプリの起動が完了したイベント発生時に**CREATE TABLEするようにします。

`index.js`に以下の処理を足します。

```javascript
document.addEventListener('init', function(event) {
    // ...
});

document.addEventListener('deviceready', function(event) {
    createTable();
});

/**
 * テーブルを作成します。
 */
function createTable() {
    var db = null;  // DBコネクション保持用

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
}
```

何かあったときにすぐに`DROP TABLE`できるようにテーブル削除用のSQLもとりあえず書いておきました。
`deviceready`イベントはアプリの読み込みが完了して準備OK！となったときに発火するイベントのようです。アプリ起動時に1度だけ発生するので、データベースの初期化なんかにちょうどいいですね。

`init`イベント内に入れてもいいのですが、ページ遷移(ページのIDが変わるたび)に実行されるので冗長です。

基本的にはSQLが間違っていない限り、もしくはよほどローカルストレージがかつかつでない限りCREATE TABLEは成功すると思います。念入りにアプリ内で失敗を検知したい場合は、エラー発生時の処理にポップアップでの表示を追加してもいいかもしれません。

アプリを起動してみて、デバッグコンソールに**テーブル初期化成功**が表示されていれば成功です。

これでデータを格納するためのテーブルの作成は完了です。


#### 登録ボタン押下時の処理を追加
いよいよ入力情報をデータベースに登録し始めます！一度に全部考えるとややこしいので、

1. 入力情報を集める
2. SQL文(INSERT)を組み立てる

の二つに分けて考えます。その前にいくつかお約束のような感じで処理を追加していきます。


#### index.jsに分岐を追加
新しい画面を追加したときのお約束ですね。`if ... else ...`の分岐に`register.html`の場合の分岐を追加します。

```javascript
if (page.id === 'button.html') {

} else if (page.id === 'list.html') {
    js_list.init(page);

} else if (page.id === 'sqltest.html') {
    js_sqltest.init(page);
    
} else if (page.id === 'register.html') {
    js_register.init(page);
    
}
```

そのあとに`list.js`あたりをコピーして`register.js`という名前のファイルを同じ場所に追加します。**var js_list**の部分を**var js_register**に変更するのを忘れないようにしてください。

最後に、変数を読み込むために`index.html`に一行追加します。

```html
<!-- 各処理読み込み -->
<script type="text/javascript" src="js/index.js"></script>
<script type="text/javascript" src="js/list.js"></script>
<script type="text/javascript" src="js/register.js"></script>
<script type="text/javascript" src="js/sqltest.js"></script>
```

`register.js`の一行を追加します。


#### 登録ボタン押下時の処理を追加
今回のエラーチェックでは、とりあえず上から順番に評価していきエラーとなったらポップアップを表示という感じで進めていきます。

ユーザーに配慮するのであれば、入力フォームの下にエラー内容を表示してあげるのが親切ですが、特に項目数も多くないので煩わしくはないはずです。。。(笑)


### 次の記事
一覧から詳細画面へと遷移する