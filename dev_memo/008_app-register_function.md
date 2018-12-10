# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(8 - TODOの登録機能を実装)
こんばんは、たねやつです。前回記事から少し間が空いてしましました。

このアプリについて若干方針を変更します。といってもすでに作成したソースを変更することはありません。
(一部使われなくなるデータベースのカラムが存在するようになってしまいますが。。)

もともとの構想では`[一覧画面] > 画面下の登録ボタンを押すと登録画面に遷移 > [登録]`という風にしようとしていましたが、
よりシンプルに`[一覧画面] > 一覧画面下部に固定している入力項目と登録ボタンから登録`という感じにします。これにより重要フラグなどの項目を(現段階では)いじることができなくなり、固定値を登録するようにします。


### 前の記事
データベースについて
[https://www.taneyats.com/entry/cordova-app-7:embed]

基本的なCRUD操作について前の記事で触れましたが、今回の記事でも登場します。コピペで動作するようになっていますので「よくわからなかった」という状態でもOKです( 一一)


### 目標
- 登録処理を作成する
  - ボタン押下時の処理を追加する
  - INSERT文を実行する
- SQLについて理解を深める
- 非同期処理、Promiseについて理解を深める


### コーディング
#### 一覧画面に入力項目を追加する
まずは入力フォームと登録ボタンを追加します。追加する場所は**画面下部固定**が一番使いやすいと思われるので、そこに追加します。

HTMLでスクロールしても画面下部に張り付くような要素を作成しようとすると結構めんどくさいのですが、OnsenUIでは`ons-bottom-toolbar`という要素が用意されており簡単に実装することができます。

[https://ja.onsen.io/v1/reference/ons-bottom-toolbar.html:embed]

結構前の記事で作成した`list.html`のソースを変更します。以下のようにしてください。`ons-list`要素内にヘッダーとかの要素があった場合もとりあえず削除してください。(あっても問題ないですが)

```html
<ons-page id="list.html">
    <ons-toolbar>
        <div class="left"></div>
        <div class="center">TODO LIST</div>
        <div class="right"></div>
    </ons-toolbar>

    <ons-list id="list">
    </ons-list>

    <ons-bottom-toolbar>
        <!-- 入力部 -->
        <ons-input id="input-title" class="input-title" placeholder="What to do?" underline="false"></ons-input>
        
        <!-- 登録ボタン -->
        <ons-button id="register-button" modifier="quiet">
            <ons-icon icon="fa-check"></ons-icon>
        </ons-button>
    </ons-bottom-toolbar>
</ons-page>
```

`index.css`の末尾にも追加します。

```css
/* 入力項目 */
ons-bottom-toolbar {
    height: 3em !important;
    text-align: center;
}

/* 入力項目 */
.input-title {
    margin-top: 4%;
    width: 85%;
}
```

これで以下のような感じの画面になります。

<!-- ボトムバーを追加した画面 -->

`<ons-icon icon="fa-check">`の部分を変更するとボタン部分のアイコンを変更できます。また、`modifier="quiet"`を削除すると普通のボタンのような見た目になります。


#### 登録ボタン押下時の処理
ボタン押下時の処理を追加します。既に過去に一覧を動的に作成する処理をここに記述していますが、とりあえず一旦全部コメントアウトしておいてください。ソースを全選択した状態で`Ctrl + /`で全コメントアウトできます。動的に一覧を作成する処理は後々使いまわします。

以下のように処理を書き換えます。

```javascript
var js_list = {
    /**
     * ページ表示時の処理
     */
    init : function(page) {
        // 登録ボタンに処理を追加
        var elem_reg_btn = document.getElementById('register-button');
        elem_reg_btn.addEventListener('click', this.onClickRegisterButton.bind(this), false);
    },

    /**
     * 登録ボタン押下時の処理
     */
    onClickRegisterButton : function() {
        console.log('register button clicked');
    },
}
```

`onClickRegisterButton`関数内に登録時の処理を追加していきます。関数内でも親のthis(`js_list`)を参照したいので関数に`.bind(this)`をつけてあげてください。


##### 入力値の取得
入力項目に入力した文字列を取得するには、`<ons-input>`の`value`というキーを参照すると取得することができます。

ですので、`onClickRegisterButton`を以下のようにして入力値を取得します。

```javascript
/**
 * 登録ボタン押下時の処理
 */
onClickRegisterButton : function() {
    var values = {};    // 入力値格納用

    // 入力値の取得
    var elem_input = document.getElementById('input-title');
    values.title = elem_input.value;
},
```

これで`title`という変数に入力した文字列が代入されました。デバッグ分などで確認したい場合には、

```javascript
/**
 * 登録ボタン押下時の処理
 */
onClickRegisterButton : function() {
    var values = {};    // 入力値格納用

    // 入力値の取得
    var elem_input = document.getElementById('input-title');
    values.title = elem_input.value;
    console.log(values);
},
```

とすることでデバッグコンソールに`values`が保持している値が表示されます。指定している変数が配列やオブジェクトの場合でもVSCodeではいい感じにデバッグコンソールに表示してくれます。ステップ実行でも値を確認することができますが、これでも手軽に確認することができます。


##### エラーチェック
何も入力しないまま登録ボタンを押した時のエラーチェックを追加します。
`onClickRegisterButton`の内容に少し追加、新たにエラーチェック用の関数などを追加します。

```javascript
/**
 * 登録ボタン押下時の処理
 */
onClickRegisterButton : function() {
    // 省略...

    // エラーが発生している場合、以降の処理を行わない
    if (!this.checkError(values)) return;
},

/**
 * エラーチェックを行います。
 * @param {Object} values 入力値
 * @returns {boolean} エラーがあればfalse
 */
checkError : function(values) {
    if (values == {}) {
        this.dispNoTitlePopup('入力値を正しく取得できません。');
        return false;
    }

    // 入力値のチェック
    if (values.title == null || values.title == '') {
        // 値が取得できない OR 空の場合エラー
        this.dispNoTitlePopup('タイトルを入力してください。');
        return false;
    }

    return true;
},

/**
 * タイトルなしのポップアップを表示します。
 * @param {String} message メッセージ部分に表示する内容 
 */
dispNoTitlePopup : function(message) {
    ons.notification.alert({
        title: '',
        message: message
    })
}
```

`values`に格納した値をエラーチェック用の関数に渡してチェックしています。値の取得とチェックを別関数に分ける場合にはこのようにオブジェクトに格納して一つの変数として渡してしまうのがすっきりしているかと思います。(今回は`title`というキー1つなので冗長かもしれませんが)

`checkError()`では**入力項目の値を取得できているかどうか、空かどうか**のチェックをしています。

ただ、この状態では**半角/全角スペースのみの入力の場合にすり抜けて登録できていします。**今回はそこまで考慮する気はないですが、実装する場合には**正規表現**を駆使してスペースをヒットさせる必要があります。

[http://blog.livedoor.jp/time_reap/archives/51453621.html:embed]

`checkError()`内で、`dispNoTitlePopup()`という関数を使用していますが、これは`ons.notification.alert()`をタイトル無しで表示させるための[ラッパー](https://affiliate-copywriting.tokyo/js-wrapper-function/)です。

毎回、

```javascript
ons.notification.alert({
    title: '',
    message: 'メッセージです。'
});
```

と記述するのが面倒なため作成しています。より大きな規模のアプリであれば、汎用部品として切り分けて`Error`,`Warning`,`Success`,`タイトルなし`といくつか作成しておくといいかもしれません。

簡易ですが入力値のエラーチェックは以上です。


##### 初期テーブルの作成
次にデータを格納しておくためのデータベース、およびテーブルの初期化を行います。ローカルDBについていろいろやりましたが基本は同じです。テーブル項目は入力項目に合うように変更しましょう。

```sql
CREATE TABLE IF NOT EXISTS todo (
    id          INTEGER PRIMARY KEY,    -- ID(主キー)
    valid       TEXT    NOT NULL,       -- 有効フラグ
    title       TEXT    NOT NULL,       -- タイトル
    date        TEXT    NOT NULL        -- 登録日時
);
```

方針変更でもともとはもっとカラムを持っているはずでしたが極力シンプルにしました。

テーブルの作成は、アプリ起動時の一回だけでいいので**アプリの起動が完了したイベント発生時に**CREATE TABLEするようにします。

`index.js`の処理を以下のようにします。

```javascript
// アプリ起動時に一度のみ実行
document.addEventListener('deviceready', function(event) {
    createTable();
});

// 各ページの初期表示
document.addEventListener('init', function(event) {
    // ... そのまま残しておく
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
                + "    date        TEXT    NOT NULL"        // 登録日時
                + ")",

            drop_table :
                "DROP TABLE IF EXISTS todo",
        }
    
    // SQL実行
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

`init`イベント内に入れてもいいのですが、ページ遷移(ページのIDが変わるたび)に実行されてしまいます。**テーブルが存在していないときだけCREATE TABLEを実行するようになっているので無害ですが、**冗長ですね。

基本的にはSQLが間違っていない限り、もしくはよほどローカルストレージがかつかつでない限りCREATE TABLEは成功すると思います。念入りにアプリ内で失敗を検知したい場合は、エラー発生時の処理にポップアップでの表示を追加してもいいかもしれません。

アプリを起動してみて、デバッグコンソールに**テーブル初期化成功**が表示されていれば成功です。


##### INSERT処理
データの登録を行います。**今回は特にエラーチェックを設けていないので**値が取得できていればそのままINSERT文を実行するようにします。

もしデータのチェック(文字の長さ制限、特定の文字列を含んでいる場合にエラーとしたいなど)を行うのであれば、INSERT文を実行する前に行う必要があります。

`onClickRegisterButton`の関数に以下の処理を追加、他関数を追加します。

```javascript
/**
 * 登録ボタン押下時の処理
 */
onClickRegisterButton : function() {
    // 省略...

    // INSERT処理を実行
    this.execInsertSql(values)
        .then(function() {
            // 成功時
            this.dispNoTitlePopup('登録しました!');
            elem_input.value = '';
        }.bind(this))
        .catch(function() {
            // 失敗時
            this.dispNoTitlePopup('登録に失敗しました...');
        }.bind(this));
},

/**
 * INSERT文を実行します。
 * @param {Object} values 入力値
 */
execInsertSql : function(values) {
    // INSERT文の実行
    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            // INSERT文
            var insert_sql =
                    'INSERT INTO todo (valid, title, date)'
                  + 'VALUES (1,?,CURRENT_TIMESTAMP)';
            
            var insert_val = [values.title];

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
            resolve();
        });
    });
},
```

以前作成したSQLの実行分とほぼ同じで、成功したときに`resolve()`, 失敗したときに`reject()`を行いPromise型の値を返す関数です。

Promiseや非同期処理に関しては、以下のページを参考にしてください!

[https://qiita.com/kiyodori/items/da434d169755cbb20447:embed]

[https://webbibouroku.com/Blog/Article/promises:embed]

データベース操作はスマホ内のファイルへのIN/OUTが発生するために、非同期処理(一旦処理が完了するのを待ってから次の処理)にしてあげる必要があります。JavaScriptではこういった処理が発生したときには、処理の完了を待たずに次の処理を進めてしまため、このように書く必要があります。

時間のかかる処理が完了したときに、再び値を取りに来る約束(promise)をするという感じだそうです。

実行しているSQL文は、

```sql
INSERT INTO todo (valid, title, date)
VALUES (1,[入力値]タイトル,CURRENT_TIMESTAMP)
```

です。`valid`カラムは登録されて削除(完了)していないデータには`1`、そうでないデータには`0`が入ります([論理削除](https://qiita.com/jonson29/items/4743409eda08fcdf5410))。主キーである`id`は指定しなければSQLiteの場合は自動で連番を振ってくれるようです。

INSERT文を実行して成功している場合は、成功時のポップアップと**入力項目の初期化**(`elem_input.value = '';`)を行います。失敗時には失敗のポップアップをとりあえず表示させておきます。

<br>
***
<br>

これで登録ボタンを押したときのエラーチェックと登録処理、後処理が完了しました!
コードにエラーが発生していないことを確認してから仮想端末を起動して動作を確認してみましょう!

入力項目がからの状態で登録ボタンを押して、エラーのポップアップが表示されることや、何か入力して登録ボタンを押して、成功のポップアップが表示されること、**入力項目がクリアされること**などを確認してください。

<!-- 空の場合のポップアップ -->

<!-- 登録成功時のポップアップ -->

ポップアップが正常に表示されない、入力項目がクリアされないなどの問題がある場合は、**コードのステップ実行や変数のインスペクションを駆使して**バグとりを進めましょう。プログラム作ってる感が出てきましたね(笑)

この記事が参考になるかと思います。
[http://www.atmarkit.co.jp/ait/articles/1707/21/news030_3.html:embed]

あるいは、<font color="red">例外</font>が発生している箇所を特定して修正する方法もあります。JavaScriptでは例外が発生すると以降のコードは実行されない、かつデバッグコンソールに**必ず表示されるわけでもない**ので発見が難しい場合があります。

VSCodeでは**例外が発生したときに処理を一時中断してステップ実行状態にする**方法があります。

[http://www.atmarkit.co.jp/ait/articles/1707/21/news030_2.html:embed]

上の記事中の赤丸②の部分に`すべての例外(All Exceptions)`とあるのでそこにチェックを入れて実行すると例外発生場所をキャッチできます。

これで登録処理に関して完了です。お疲れ様です。 ^^) _旦~~

### 最後に
SQLの実行や非同期処理の実装などちょっとややこしい部分も出てきましたがいかがでしたでしょうか?

一番難しい部分はこれで完了なのであとは今回ほど難しくない(はず)です(笑)
一覧で表示する処理もすでに作成済みなので安心ですね!

今回登録した値が見えないまま終わってしまってヤキモキするかもしれませんが、次の記事で登録した値の取得と表示を行います。その次の記事ではTODOの削除機能となる予定です。

### 次の記事
登録したデータを表示させる
[https://www.taneyats.com/entry/cordova-app-9:embed]
