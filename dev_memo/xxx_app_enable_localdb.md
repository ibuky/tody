# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(# - ローカルDBの作成、有効化)

今回はスマホ内に作成するデータベースについてです。

アプリの画面から登録した値を、**アプリが終了した後でも保持しておくために**必要となってきます。データベースがない(例えば登録した値はオブジェクトとして変数に保持しておくなど)アプリの場合、アプリの終了時に変数の値はクリアされてしまいます。



### 前の記事
### 目標
- DB(データベース)を触る。
- CRUD(Create/Refer/Update/Delete)ができるようになる。
  - `INSERT`, `SELECT`, `UPDATE`, `DELETE`文を作成できるようになる。

といいましたが、SQLの文法については詳しく触れるつもりはないです。ちらりとProgateをのぞいてみましたが、最近はSQLなんかもあるんですね！これは心強い(*'ω'*)

SQLの基本などについては、

[https://qiita.com/devopsCoordinator/items/9b70e506150888e190be:embed]

[https://www.google.co.jp/search?safe=off&q=sql+%E5%88%9D%E5%BF%83%E8%80%85&sa=X&ved=0ahUKEwjjopv7wqrdAhUBwrwKHSKQD44Q1QIIeCgA&biw=601&bih=1037:embed]

[http://www.atmarkit.co.jp/ait/articles/0103/23/news003.html:embed]

らへんを参考にしてみてください。


### プラグインのインストール
#### cordova-sqlite-storage
`cordova-sqlite-storage`を使ってスマホ内にDBを作成します。プロジェクト内のターミナルで以下のコマンドを実行してプラグインをインストールします。

```
> cordova plugin add cordova-sqlite-storage
...
Saved plugin info for "cordova-sqlite-storage" to config.xml
```

完了するとソースが追加され、`config.xml`に一行追加されます。

```xml
<plugin name="cordova-sqlite-storage" spec="^2.4.0" />
```

### コーディング
#### DBコネクションを取得する
DBにデータを登録したり参照したりするためには、まずは対象のデータベースと繋がる必要があります。これをコネクションを取得といいます。SSHやFTPで接続先を指定して認証するのと同じような感じですね。

その前にアプリ起動時にテスト用の画面を呼び出すようにしましょう。`list.html`を追加した時と同じような手順を`sqltest.html`という名前で進めていきます。

1. `index.html`のナビゲーターで指定している`page`の値を`sqltest.html`に変更
2. `sqltest.html`というファイルを`list.html`と同じ場所に作成。中身はこんな感じでほぼ空のままにしておく

    ```html
    <ons-page id="sqltest.html">
    </ons-page>
    ```

3. `index.js`で`sqltest.html`読み込み時の処理を追加する。
    ```javascript
    ...
    } else if (page.id === 'sqltest.html') {
        js_sqltest.init(page);
    }
    ```
    
4. `sqltest.js`を`list.js`と同じ場所に作成。中身はこんな感じ。
    ```javascript
    var js_sqltest = {
        init : function(page) {
        },
    };
    ```

これでアプリアプリ起動時に今回のテスト用のページと処理(`js_sqltest.init()`)が実行されるようになります。

次に`init`内にDBコネクションを取得する処理を書いていきます。

```javascript
init : function(page) {
    var db = null;  // DBコネクション保持用

    // DBコネクションを取得
    db = window.sqlitePlugin.openDatabase({
        name     : 'todolist.db',
        location : 'default',
    })

    console.log(db);
},
```

オブジェクト生成時の引数に、`name`, `location`を渡しています。`location`に関しては以下のリンクで説明されていますが、特に何も考えずに`default`を指定しておいて問題ないです。

[https://qiita.com/rhikos/items/110221a9ab7b415112a8:embed]

アプリ起動後、デバッグコンソールに以下のような感じのログが出力されていればコネクション成功です。
(console.logを仕込まなくても、プラグインで勝手にログ出力してくれていますね('Д'))

```
SQLitePlugin {openargs: Object, dbname: "todolist.db", openSuccess: , openError: }
sqltest.js:11
OPEN database: todolist.db - OK             SQLitePlugin.js:179
DB opened: todolist.db                      SQLitePlugin.js:80
```

これで`todolist.db`に対してSQLを実行できる状態になりました。

#### SQLを実行する
##### テーブルを作成する
値を登録するためには、テーブルというものを作成する必要があります。感覚的には`エクセル`がデータベースで`シート`がテーブル、列が登録されている値という感じになります。

まずは実行する`CREATE TABLE`文を作成します。いったん文字列として値を代入して置くほうがスマートかもしれません。`console.log()`の後にこの処理を追加します。

```javascript
// テーブル作成用SQL
var sql_create = ""
    + "CREATE TABLE IF NOT EXISTS test ("
    //   カラム名    データ型
    + "  id         INTEGER PRIMARY KEY,"
    + "  text       TEXT"
    + ")";

console.log(sql_create);

// SQLを実行
db.transaction(function(tx) {
    // 実行部分
    tx.executeSql(sql_create);

}, function(error) {
    // SQL処理エラー発生時の処理
    console.log('エラーが発生しました : ' + error.message);

}, function() {
    // SQL処理成功時の処理
    console.log('テーブルが作成されました。');
    
})
```

SQLの`CREATE TABLE`の構文としては、

```
CREATE TABLE (IF NOT EXISTS) [テーブル名] (
    [カラム名]  [データ型]  [NULL制約],
    ...
);
```

という感じです。NULL制約に`NOT NULL`を指定したカラムは、INSERT時に値が指定されていない場合エラーとなります。必須項目という感じです。

テーブル作成時に`IF NOT EXISTS`を追加することで、すでに同名のテーブルが存在してる場合何もしないようになります。

データ型の部分に(厳密にはデータ型ではないですが、、、) `INTEGER PRIMARY KEY`を指定するとSQLiteの場合は、自動でID値としてインクリメントしてくれるようです。PostgreSQLでは`serial`型を指定すると同様のことができるアレですね。(postgreSQLぐらいしか使ったことなかったので若干ここではまりましたorz)

上のコードを書いて、アプリを実行すると自動的にSQLが実行されるはずです。

エラーが発生している場合は、とりあえず`console.log(sql_create);`で出力しているSQL文を確認して問題がないかを確認・エラーメッセージをググるなどして対処してください。カンマが足りていないとか逆に多すぎるというエラーが不注意で発生しがちです( 一一)


##### データを登録する(INSERT)
テーブルが作成できたら、次はデータを登録してみましょう。以下のように登録用のSQLを追加して、実行部分も一行追加します。追加で変数がごちゃごちゃしてきたので、オブジェクトにまとめたいと思います。

```javascript
var sql = {
    create_table :
          "CREATE TABLE IF NOT EXISTS test ("
        //   カラム名    データ型
        + "  id         INTEGER PRIMARY KEY,"
        + "  text       TEXT"
        + ")",

    insert : "INSERT INTO test (text, date) VALUES (?)",
}

// SQLを実行
db.transaction(function(tx) {
    // 実行部分
    tx.executeSql(sql.create_table);
    tx.executeSql(sql.insert, ['テスト']);

}, function(error) {
    // SQL処理エラー発生時の処理
    console.log('エラーが発生しました : ' + error.message);

}, function() {
    // SQL処理成功時の処理
    console.log('処理成功');

})
```

INSERT文は以下のような文法です。

```
INSERT INTO [テーブル名] ([カラム名をカンマ区切りで指定]) VALUES([登録したい値をカンマ区切りで指定]);
```

VALUES()に?を指定しておくことで、実行時に一緒に渡す配列の前から順に値を投入してくれます。もちろんそのまま値を突っ込んでもいいですが可変な値をループしていれる場合なんかにはこっちのほうが便利です。(Prepared Statement)

`tx.executeSql(sql.create_table);`の部分は残しておいても問題ないです。`IF NOT EXISTS`条件を追加しているので、**テーブルの存在していない初回起動時**以外はテーブル作成は実行されません。

`CURRENT_TIMESTAMP`を指定することで現在時刻のタイムスタンプを取得できます。

これを実行して処理が無事成功していれば、データは登録できています。


##### データを照会する(SELECT)
登録されたデータを確認するためには、`SELECT`文を実行する必要があります。今後ほかの場面でもSQLを使うことが皆さんあると思いますが、9割方このSELECT文を実行することになります。

```
SELECT [取得したいカラム名]
  FROM [取得したいカラムのテーブル名]
 WHERE [条件]
```

という書式が基本形です。テーブルの結合やサブクエリなどをあげだすとキリがないですが、今回のアプリで使用するのは今のところ**単純なWHERE条件での絞り込み**なのでとあえず基本形だけでも覚えてみてください。

以下のコードで先ほどまでに登録したデータをすべて取得するSELECT文の発行と、取得できた値をすべてコンソールに出力することができます。**一旦INSERT文を実行している部分はコメントアウトしておいてください。**

```javascript
var sql = {
    // ...

    select : "SELECT * FROM test",
}

//...

// SQL(SELECT)を実行
db.transaction(function(tx) {
    tx.executeSql(sql.select, [], function(tx, result) {    // SELECT文発行
        console.log(result.rows.length);                    // 取得できた行数をログに出力
        for (var i = 0; i < result.rows.length; i++) {      // 取得できた行数分ループ
            console.log(result.rows.item(i));               // n行目のデータをログに出力
        }
    })
})
```

`SELECT`に`*`を指定すると、対象のテーブルの全カラムの値を取得することになります。(今回ならidとtext)

今回のSELECT文には?を使用していないので、`executeSql`の第2引数には空の配列を渡します。第3引数にはコールバック関数を指定します。引数`result`の`result.rows.item`の中にSELECT文を実行した結果が格納されています。複数件の値を取得している場合は、`result.rows.length`の値を使用してforで繰り返すことによって、全件参照できます。

オブジェクト型の値なので、あとは`result.rows.item(0).id`というような感じでカラム名をしていてあげることで1データの特定の値を参照できます。





##### データを更新する(UPDATE)
##### データを削除する(DELETE)








### 次の記事


### 参考
公式ドキュメント

[https://github.com/litehelpers/Cordova-sqlite-storage:embed]

Cordova アプリ内に SQLite でローカル DB を構築できる cordova-sqlite-storage

[http://neos21.hatenablog.com/entry/2017/06/23/080000:embed]

