# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(7 - ローカルDBの作成、有効化)

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

    insert : "INSERT INTO test (text) VALUES (?)",
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

//... (CREATE TABLE, INSERTの処理の部分はそのまま残しておいてください)

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
UPDATE文の文法は以下のような感じです。

```
UPDATE [テーブル名] SET [カラム名] = [更新後の値]
 WHERE [更新したい行だけを絞り込める条件] 
```

肝となるのは`WHERE`の条件部分で、**この条件指定が間違っていると予期しない行のデータも更新してしまいます。**

たとえば、会社に「田中太郎」さんが二人いるとします。
【従業員】テーブルの「田中太郎」(A)さんの退職フラグをTRUEにしたいときに、`UPDATE 従業員 SET 退職F = TRUE WHERE 名前 = '田中太郎'`とすると、「田中太郎」(B)さんの退職フラグもTRUEになってしまいます！

もちろん「一気にどちらの田中太郎さんの退職フラグをTRUEにしたい」という場合は上記のSQLでも問題はありません。しかしたいていの場合は1件のデータに対してのみ操作したい場合がほとんどです。

基本的には、DBのテーブルには一行ごとに**絶対にほか被らないユニークな値**が設定されています。これが`PRIMARY KEY`(主キー)と呼ばれるものです。たいていの場合は連番の数値となります。

今回のtestテーブルでもidというカラム名で指定していますね！

先ほどSELECT文を追加したときにコメントアウトしたINSERTの下に同じように追加します。

```javascript
var sql = {
    //...

    update : "UPDATE test SET text = '更新しました' WHERE id = 1",
}

// SQL(CREATE TABLE, INSERT)を実行
db.transaction(function(tx) {
    // 実行部分
    tx.executeSql(sql.create_table);
    // tx.executeSql(sql.insert, ['テスト']);  // これをコメントアウト
    tx.executeSql(sql.update);  // これを追加
}, function(error) {
    // SQL処理エラー発生時の処理
    console.log('エラーが発生しました : ' + error.message);

}, function() {
    // SQL処理成功時の処理
    console.log('処理成功');
    
})

// ... (SELECTの処理)
```

更新が無事できていたら、先ほどのSELECT文の処理の部分で出力しているログで確認できます。

```
Object {id: 1, text: "更新しました"}
Object {id: 2, text: "テスト"}
Object {id: 3, text: "テスト"}
Object {id: 4, text: "テスト"}
Object {id: 5, text: "テスト"}
```

指定したIDの行だけ内容が変更されているでしょうか？
ちなみにWHERE条件を指定せずに`UPDATE test SET text = NULL`とかを実行した場合、**testテーブル内の全行にUPDATEが実行され、textがNULL(空)になりますのでご注意を！**今回はテスト用のテーブルなので実行しても何ら問題はないですが、本番用のデータベースを触るときには要注意ですね( 一一)


##### データを削除する(DELETE)
UPDATEが無事成功していればこちらも同じような感じです。

```
DELETE FROM [テーブル名] WHERE [条件]
```

です。**こちらの場合もUPDATEと同じくWHEREで絞り込む条件が重要になってきます！**WHEREを指定しない場合、**全件削除**になるのでご注意を( 一一)
ちなみにその全件削除をうまく利用した処理なんかも存在したりしています。

以下のように処理を変更してみてください。

```javascript
var sql = {
    // ... 

    delete : "DELETE FROM test WHERE id = 1",
}

// SQL(CREATE TABLE, INSERT)を実行
db.transaction(function(tx) {
    // 実行部分
    tx.executeSql(sql.create_table);
    // tx.executeSql(sql.insert, ['テスト']);
    // tx.executeSql(sql.update);
    tx.executeSql(sql.delete);  // この行を追加
}, function(error) {
    // SQL処理エラー発生時の処理
    console.log('エラーが発生しました : ' + error.message);

}, function() {
    // SQL処理成功時の処理
    console.log('処理成功');
    
})

// ... (SELECTの処理)
```

ログに以下のように表示されていれば、成功です。
id = 1の行が削除されていますね！

```
Object {id: 2, text: "テスト"}
Object {id: 3, text: "テスト"}
Object {id: 4, text: "テスト"}
Object {id: 5, text: "テスト"}
```

以上でローカルDBへのCRUD実行は終了です！お疲れさまでした ^^) _旦~~

忘れずに`index.html`のナビゲータに指定したpageの部分を`list.html`に戻しておいてください！


### 最後に
今回はあまりアプリの処理ではなく**データベース**の部分がほとんど、しかも結構長かったので難しかったかもしれません。。。
ですがアプリや業務システムでも必ず必要になるSQLですので、覚えておいて損はないですね(*'ω'*)

次回からは再びアプリ画面に戻って、登録ボタンと登録画面の作成を進めていきたいと思います('ω')

### 次の記事


### 参考
公式ドキュメント

[https://github.com/litehelpers/Cordova-sqlite-storage:embed]

Cordova アプリ内に SQLite でローカル DB を構築できる cordova-sqlite-storage

[http://neos21.hatenablog.com/entry/2017/06/23/080000:embed]

