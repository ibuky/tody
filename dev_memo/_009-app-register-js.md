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

まずは登録ボタンを押したときの処理を追加します。`register.js`に以下のように記述します。

```javascript
var js_register = {
    init : function(page) {
        // 登録ボタン
        var submit_button = document.getElementById('submit');
        submit_button.addEventListener('click', this.onClickSubmitButton.bind(this), false);
    },
}
```

js_register.init()は`register.html`を表示したときの初期処理で実行されます。(`index.js`内で実行)

そのタイミングで登録ボタンのタップ処理を追加します。`onClickSubmitButton`という関数を設定しました。関数の後ろに`.bind(this)`というものがくっついていますがこれをしないと、**呼び出した関数内のthisがさす内容が変わってしまいます。**変わってしまっていい場合もありますが、今回の場合は`onClickSubmitButton`を呼び出した`js_register`のもつほかの関数を使いたいので`.bind(this)`をつけて参照できるようにします。

ほかにも**アロー関数**を使用するとか変数として呼び出し元のthisを渡す(self)とかいう方法があります。

[https://qiita.com/takkyun/items/c6e2f2cf25327299cf03:embed]

[https://www.deep-rain.com/programming/javascript/807:embed]

`onClickSubmitButton`の関数は以下のようにします。先ほどの``init()`の続きに追加します。

```javascript
init : function(page) {
    // ...
},

/**
 * 登録ボタン押下時の処理
 */
onClickSubmitButton : function() {
    if (!this.checkInputData()) {    // 入力情報のチェックとともに、結果を評価
        // エラー発生時、後続処理を一切実行しない
        return;
    }

    var input_data = this.getInputData();   // 入力情報の取得

    // INSERT文の実行(Promise)
    this.execInsertSql(input_data)
        .then(function() {
            // INSERT成功時
            this.showNoTitlePopup('登録しました！');
            document.getElementById('navi').resetToPage('list.html');   // 一覧画面に戻る
        }.bind(this))
        .catch(function() {
            // INSERT失敗時
            this.showNoTitlePopup('登録に失敗しました...');
        }.bind(this));
},
```

新たに`checkInputData`, `getInputData`, `execInsertSql`, `showNoTitlePopup`という自作の関数が出てきました。順次説明して行きます。`resetToPage`は`<ons-navigator>`の持っている関数です。

コメント通りですが、**入力データのチェックを行い、問題がなければINSERT文を実行して登録する**という流れになります。SQLの間違い以外では発生しないと思いますが、処理に失敗したときにはエラーのポップアップを表示します。

JavaScriptでは関数の途中で`return`とするとその行で関数の処理を終えることができます。呼び出し元で真偽値の判定が必要な場合は`return false`などとするといいですが、今回は単純に処理を抜けたいだけなので何も返しません。

ちなみに、

```javascript
if (!this.checkInputData()) {
    return;
}
```

は、

```javascript
if (!this.checkInputData()) return;
```

と一行にまとめて書いても問題なく動きます。`{}`やインデントが不要になるのでコードがすっきりして**うまく使えば**可読性が上がります。
個人的には`return`するだけ、簡単な一行だけの処理の場合はこのように書くようにしています。

次は`checkInputData`です。

```javascript
/**
 * 入力情報のチェックを行います。
 * @returns {boolean} エラーが発生していない場合、true
 */
checkInputData : function() {
    // タイトルのチェック
    var title_val = document.getElementById('title').value;
    if (!title_val) {
        // 空の場合、エラー
        this.showNoTitlePopup('タイトルを入力してください。');
        return false;
    }

    if (title_val.length > 50) {
        // 50文字以上の場合、エラー
        this.showNoTitlePopup('タイトルは50字以内で入力してください。');
        return false;
    }

    // 詳細情報のチェック
    var detail_val = document.getElementById('detail').value;
    
    if (detail_val) {
        // 詳細情報に入力がある場合
        if (!detail_val.match(/\n/g)) {
            // 改行コードが存在していない場合(1行)
            return true;
        }
        
        // 改行コードが存在している場合(2行以上)
        var detail_line_count = detail_val.match(/\n/g).length + 1;
        
        // 行数チェック
        if (detail_line_count > 5) {
            // 6行以上の入力の場合、エラー
            this.showNoTitlePopup('内容は5行以内で入力してください。');
            return false;
        }
    }
    
    // 何もエラーがない場合、trueを返す
    return true;
},
```

エラー発生時にはこの関数内でエラーの旨を表示するポップアップを生成します。

行っているエラーチェックは、

1. タイトルの必須入力チェック
2. タイトルの長さチェック(不完全)
3. 詳細情報の行数チェック

です。最低限実装しなければならないエラーチェックは1の必須入力チェックです。(一覧画面に表示する文字列は必ず必要。)ほかの部分に関してはなくても(とりあえず)問題ありません。

2の長さチェックはかなり適当です。全角半角をちゃんと考慮していませんが`SQLite`であれば桁数関係なく登録できてしまうようなのでそのままです。

行数チェックの部分では**改行コード**の数を判定して何行かをカウントしています。

[https://webss.blog.so-net.ne.jp/2017-11-03-1:embed]

次は`getInputData`です(-ω-)

```javascript
/**
 * 画面に入力された値を取得します。
 * @returns {Object} 画面に入力された値
 */
getInputData : function() {
    var input_vals = {};    // 入力値保持用
    
    input_vals.title     = document.getElementById('title').value;  // タイトル
    input_vals.detail    = document.getElementById('detail').value; // 詳細情報
    input_vals.important = this.getYnValueForSwitch(document.getElementById('important').checked);    // 重要フラグ
    input_vals.urgent    = this.getYnValueForSwitch(document.getElementById('urgent').checked);       // 緊急フラグ
    
    return input_vals;
},

/**
 * スイッチのON/OFF状態を判定し、y/nの値を返します。
 * @param {boolean} val switch要素のchecked
 * @returns {string} スイッチがONの場合、1(true)
 */
getYnValueForSwitch : function(val) {
    if (val) {
        return '1'; // スイッチがONの場合
        // return this.FLAG_Y; // スイッチがONの場合
    } else {
        return '0'; // スイッチがOFFの場合
        // return this.FLAG_N; // スイッチがOFFの場合
    }
},
```

入力された値をまとめて、オブジェクトに格納して返すだけの関数です。重要・緊急スイッチの部分に関しては`document.getElementById('important').checked`の真偽値(true/false)でスイッチのON/OFFを判定可能です。そのまま真偽値をデータベースに突っ込むことは(おそらく)できないので、trueの場合1, falseの場合0にする関数も追加しています。

次は`showNoTitlePopup`です。あと少し('◇')ゞ

```javascript
/**
 * タイトルなしのポップアップを表示します。
 * @param {string} message 表示するメッセージ
 */
showNoTitlePopup : function(message) {
    ons.notification.alert({
        title : '',
        message : message,
    })
},
```

`ons.notification.alert`のラップ関数(既存の関数をより簡単、目的に沿って使えるように包む(ラップする)関数)です。そのまま実行するとでかでかと`ALERT`とタイトルが表示されてしまうのが微妙なので作成しました。ALERTの文字が消えることで汎用的なポップアップとして使えるようにもなりますね！

最後に`execInsertSql`です。一番手ごわいかもしれない！


```javascript
/**
 * 入力した情報からINSERT文を発行します。
 * @param {object} input_data 入力情報
 * @returns {Promise}
 */
execInsertSql : function(input_data) {
    // INSERT文の実行
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            var insert_sql = 
                    'INSERT INTO todo (valid, title, detail, important, urgent, date) '
                + 'VALUES (1,?,?,?,?,CURRENT_TIMESTAMP)';   // INSERT文

            var insert_val = [
                input_data.title,
                input_data.detail,
                input_data.important,
                input_data.urgent
            ]

            tx.executeSql(insert_sql, insert_val);
        },
        function(error) {
            // INSERT失敗時
            console.log('INSERTに失敗しました : ' + error.message);
            reject();
        },
        function() {
            // INSERT成功時
            console.log('INSERTに成功しました');
            console.log(input_data);
            resolve();
        });
    });
},
```

端的に言ってしまえば、以前作成したSQLの実行分とほぼ同じで、成功したときに`resolve()`, 失敗したときに`reject()`を行いPromise型の値を返す関数です。

Promiseや非同期処理に関しては、以下のページを参考にしたほうがいいと思います。

[https://qiita.com/kiyodori/items/da434d169755cbb20447:embed]

[https://webbibouroku.com/Blog/Article/promises:embed]

データベース操作はスマホ内のファイルへのIN/OUTが発生するために、非同期処理(一旦処理が完了するのを待ってから次の処理)にしてあげる必要があります。

`insert_val`の部分はオブジェクト型を配列型に入れなおしているのですがなんかもっとスマートな書き方があると思います(>_<)


実行しているSQL文は、

```sql
INSERT INTO todo (valid, title, detail, important, urgent, date)
VALUES (1,[入力値]タイトル,[入力値]詳細情報,[入力値]重要フラグ,[入力値]緊急フラグ,CURRENT_TIMESTAMP)
```

です。`valid`カラムは登録されて削除(完了)していないデータには`1`、そうでないデータには`0`が入ります(論理削除)。主キーである`id`は指定しなければSQLiteの場合は自動で連番を振ってくれるようです。

これですべての関数が出そろいました！(笑) `register.js`のソースの全体は以下のような感じになります。

```javascript
var js_register = {
    /* 定数 */
    FLAG_Y : '1',  // フラグ(true)
    FLAG_N : '0',  // フラグ(false)

    /**
     * ページ表示時の処理
     */
    init : function(page) {
        // 登録ボタン
        var submit_button = document.getElementById('submit');
        submit_button.addEventListener('click', this.onClickSubmitButton.bind(this), false);
    },

    /**
     * 登録ボタン押下時の処理
     */
    onClickSubmitButton : function() {
        if (!this.checkInputData()) {    // 入力情報のチェックとともに、結果を評価
            // エラー発生時、後続処理を一切実行しない
            return;
        }

        var input_data = this.getInputData();   // 入力情報の取得

        // INSERT文の実行(Promise)
        this.execInsertSql(input_data)
            .then(function() {
                // INSERT成功時
                this.showNoTitlePopup('登録しました！');
                document.getElementById('navi').resetToPage('list.html');   // 一覧画面に戻る
            }.bind(this))
            .catch(function() {
                // INSERT失敗時
                this.showNoTitlePopup('登録に失敗しました...');
            }.bind(this));
    },

    /**
     * 入力情報のチェックを行います。
     * @returns {boolean} エラーが発生していない場合、true
     */
    checkInputData : function() {
        // タイトルのチェック
        var title_val = document.getElementById('title').value;
        if (!title_val) {
            // 空の場合、エラー
            this.showNoTitlePopup('タイトルを入力してください。');
            return false;
        }

        if (title_val.length > 50) {
            // 50文字以上の場合、エラー
            this.showNoTitlePopup('タイトルは50字以内で入力してください。');
            return false;
        }

        // 詳細情報のチェック
        var detail_val = document.getElementById('detail').value;
        
        if (detail_val) {
            // 詳細情報に入力がある場合
            if (!detail_val.match(/\n/g)) {
                // 改行コードが存在していない場合(1行)
                return true;
            }
            
            // 改行コードが存在している場合(2行以上)
            var detail_line_count = detail_val.match(/\n/g).length + 1;
            
            // 行数チェック
            if (detail_line_count > 5) {
                // 6行以上の入力の場合、エラー
                this.showNoTitlePopup('内容は5行以内で入力してください。');
                return false;
            }
        }
        
        // 何もエラーがない場合、trueを返す
        return true;
    },

    /**
     * 画面に入力された値を取得します。
     * @returns {Object} 画面に入力された値
     */
    getInputData : function() {
        var input_vals = {};    // 入力値保持用
        
        input_vals.title     = document.getElementById('title').value;  // タイトル
        input_vals.detail    = document.getElementById('detail').value; // 詳細情報
        input_vals.important = this.getYnValueForSwitch(document.getElementById('important').checked);    // 重要フラグ
        input_vals.urgent    = this.getYnValueForSwitch(document.getElementById('urgent').checked);       // 緊急フラグ
        
        return input_vals;
    },

    /**
     * スイッチのON/OFF状態を判定し、y/nの値を返します。
     * @param {boolean} val switch要素のchecked
     * @returns {string} スイッチがONの場合、1(true)
     */
    getYnValueForSwitch : function(val) {
        if (val) {
            return this.FLAG_Y; // スイッチがONの場合
        } else {
            return this.FLAG_N; // スイッチがOFFの場合
        }
    },

    /**
     * タイトルなしのポップアップを表示します。
     * @param {string} message 表示するメッセージ
     */
    showNoTitlePopup : function(message) {
        ons.notification.alert({
            title : '',
            message : message,
        })
    },

    /**
     * 入力した情報からINSERT文を発行します。
     * @param {object} input_data 入力情報
     * @returns {Promise}
     */
    execInsertSql : function(input_data) {
        // INSERT文の実行
        return new Promise(function(resolve, reject) {
            db.transaction(function(tx) {
                var insert_sql = 
                      'INSERT INTO todo (valid, title, detail, important, urgent, date) '
                    + 'VALUES (1,?,?,?,?,CURRENT_TIMESTAMP)';   // INSERT文

                var insert_val = [
                    input_data.title,
                    input_data.detail,
                    input_data.important,
                    input_data.urgent
                ]

                tx.executeSql(insert_sql, insert_val);
            },
            function(error) {
                // INSERT失敗時
                console.log('INSERTに失敗しました : ' + error.message);
                reject();
            },
            function() {
                // INSERT成功時
                console.log('INSERTに成功しました');
                console.log(input_data);
                resolve();
            });
        });
    },
}
```

これで登録画面で値を入力して登録ボタンを押すと、問題なければSQLが実行されてDBに値が登録されるはずです。登録処理時にデバッグ文を仕込んでいるのでコンソールからも**処理の成功・失敗と、登録した値**が参照可能です。


```
INSERTに成功しました
Object {title: "これはテストです。", detail: "確認用", important: "0", urgent: "0"}        register.js:152
```

といった感じで表示されていれば完了です。**赤文字でエラーが表示されている場合は**どの部分でエラーが発生しているのかを特定してちまちま直していくしかないです('◇')ゞ こうやってちまちま修正するのはかなりめんどくさいですが、コードのコピペなんかよりも100倍勉強になるので頑張りましょう！

一番の目安はコンソールに表示されている処理ファイルと処理行のログです。**先ほどのINSERT成功時のログにも末尾に register.js:152 と表示されています。**


### 最後に
一番処理数の多い登録画面はこれで完了です。

残すところは**一覧表示、削除、更新**の3つの機能ぐらいかな？という感じです。20記事以内には収めたいですが何せ作りながら書いているもんで、、(笑)


### 次の記事
一覧画面をデータベースの値から表示するようにする