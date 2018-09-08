# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(# - ローカルDBの作成、有効化)

### 前の記事
### 目標
- DB(データベース)を触る。
- CRUD(Create/Refer/Update/Delete)ができるようになる。
  - `INSERT`, `SELECT`, `UPDATE`, `DELETE`文を作成できるようになる。

といいましたが、SQLの文法については詳しく触れるつもりはないです。ちらりとProgateをのぞいてみましたが、最近はSQLなんかもあるんですね！これは心強い(*'ω'*)

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
##### データを登録する(INSERT)
##### データを照会する(SELECT)
##### データを更新する(UPDATE)
##### データを削除する(DELETE)






### 次の記事


### 参考
公式ドキュメント

[https://github.com/litehelpers/Cordova-sqlite-storage:embed]

Cordova アプリ内に SQLite でローカル DB を構築できる cordova-sqlite-storage

[http://neos21.hatenablog.com/entry/2017/06/23/080000:embed]

