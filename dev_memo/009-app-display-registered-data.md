# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(9 - 登録したデータを表示する)
こんにちは、たねやつです。今回もアプリ作成を進めていきましょう！
前回の登録の部分でとりあえず全体の半分ちょっとは完了しましたのであとちょっとです！

### 前の記事
[https://www.taneyats.com/entry/cordova-app-8:embed]


### 目標
- SQLについて理解を深める
- データベースから取得した値を画面に表示させる

今回はSQLの`SELECT`文を使用します。SQLの操作において一番使用頻度の高いヤツですね('ω')

### コーディング
#### list.html表示時に一覧を作成
前回の登録処理ですでにいくつかのデータを登録していると思いますが、まだ本当に登録できているのかを確認できていませんね(笑)
前回記事の中でSELECT文を実行して確認してみるのも良かったのですが、結局この記事でまた同じようなことを行うのであえて書きませんでしたm(__)m

まずは`list.html`が表示された時に、データベースにアクセスして登録されているデータを取得する処理を追加します。

`list.js`内の`init()`内に以下を追加します。登録ボタンの処理の部分よりも前に書いても後ろに書いても大丈夫です。

```javascript
/**
 * ページ表示時の処理
 */
init : function(page) {
    // 登録ボタンに処理を追加
    // ...省略

    // 登録されているデータの取得
    this.getRegisteredData()
        .then(function(ret) {
            this.dispTodoList(ret);
        }.bind(this))
        .catch(function() {
            // 失敗時
            this.dispNoTitlePopup('一覧の作成に失敗しました。')
        }.bind(this))
},
```


##### 登録されているデータを取得
`getRegisteredData`という関数でPromiseを返し、成功時と失敗時の処理という感じは登録処理と同じですね。この関数内でSQLを実行してデータを取得するのですが**取得成功時に、そのデータで一覧を作成し、**取得失敗時にはエラーのポップアップを表示します。

次に`getRegisteredData`の中身です。`dispNoTitlePopup`の関数の下あたりに追加しておきましょう。一番最後にすべてのソースを書き終わってから関数の並びは整理しようと思います。

```javascript
dispNoTitlePopup : function(message) {
    // ...省略
},

/**
 * データベースに登録されているデータを取得します。
 * @returns {Array} 登録されているデータ
 */
getRegisteredData : function() {
    return new Promise(function(resolve, reject) {
        var ret = [];   // return用の値保持用
        
        // 登録情報取得SQL
        var select_sql = 
              "SELECT id, title, date "
            + "FROM todo "
            + "WHERE valid = 1 "
            + "ORDER BY id DESC";

        // SQL(SELECT)を実行
        db.transaction(function(tx) {
            tx.executeSql(select_sql, [], function(tx, result) {
                for (var i = 0; i < result.rows.length; i++) {
                    var vals = result.rows.item(i); // 一行分のデータ
                    ret.push(vals);                 // 配列に格納してまとめる
                }
                console.log(ret);                   // デバッグ分から確認用
                resolve(ret);
            }, function(error) {
                reject();
            })
        })
    });
},
```

ちょっとヘビーな感じですが、基本的な処理の流れは登録時とほぼ同じです。

今回実行するSQLは、

```sql
SELECT id, title, date
FROM todo
WHERE valid = 1
ORDER BY id;
```

となります。登録の部分で言い忘れていましたが、**各文字列の末尾の半角スペースは必ず残しておいてください。**もし削除してしまうと、結合したときに、

```sql
SELECT id, title, dateFROM todoWHERE valid = 1ORDER BY id;
```

というようなSQL文になってしまいエラーとなります。各予約語やカラム名の後ろには必ずスペースかタブが必要です。

`WHERE`句を使用することで取得するデータの絞り込み条件を設定することができます。

`WHERE valid = 1`で有効フラグが1(true)のもののみ抽出します。あとあと削除処理を追加した時に、削除したデータは`valid = 0(false)`となるためです。

[https://dev.classmethod.jp/etc/sql_like/:embed]

`ORDER BY`句を使用することでデータの並びを整えることができます。後ろに指定したカラム(今回は`id`)を使用して順番に並べます。

`ORDER BY id`とすることで**idの小さい順(登録日時が古い順、昇順)に並びます。**これをidの大きい順(登録日時が新しい順、降順)にしたい場合は`ORDER BY id DESC`としてください。

SELECTを実行するときの鉄則として、**必ずORDER BY句とともに使用すること**というの(私の中では)あります。というのも使用しない場合、**システムの気分次第でデータの並びが変わってしまうことがあるからです。**アプリを起動するたびに順序がめちゃくちゃになるなんて困りますよね(>_<)

新しく登録したデータが一覧の上にくるようにしたいので、`ORDER BY id DESC`を私は使用します。並び順が変わるだけで処理には影響しませんのでどちらでもOKです！

<br>
***
<br>

話を戻します。SELECT文を実行して取得結果は`tx.executeSql()`のコールバック関数の第2引数(`result`)に格納されます。さらに深堀して`result.row.item[]`に配列として取得できた行分だけ値が格納されています。

ですのでfor文を使用して値を取り出しています。

すべての値を取り出し終わったら、取り出した値をデバッグに表示して`resolve()`の引数にのっけて返します。こうすることで、呼び出し元の`then()`内で使用することができます。`ret`‘という変数がまさにそれですね。


##### データから一覧を作成
次に、取得できたデータから一覧を作成します。以前作成した動的に一覧を生成する処理とほぼ同じとなります。`getRegisteredData`の`then`内の関数、`dispTodoList`に処理を追加していきます。

`getRegisteredData`の関数の下に以下のような感じで追加してください。

```javascript
getRegisteredData : function() {
    // ...省略
},

/**
 * 取得した値で一覧を作成します
 * @param {Array} data 取得した値
 */
dispTodoList : function(data) {
    var elem_list = document.getElementById('list');    // <ons-list id="list">を取得
    
    for (var i = 0; i < data.length; i++) {
        // 空の<ons-list-item>を作成
        var elem_list_item = document.createElement('ons-list-item');
    
        // 属性を追加
        elem_list_item.setAttribute('modifier', 'chevron');
        elem_list_item.setAttribute('tappable', '');
    
        // 表示する値を追加
        elem_list_item.innerHTML = data[i].title;
        // アイテムごとの値をセット
        elem_list_item.line_data = data[i];
    
        // タップ時の動作を設定(詳細画面へ遷移)
        elem_list_item.addEventListener('click', this.onClickListItem, false);
    
        // 親要素に追加
        elem_list.appendChild(elem_list_item);
    }
},
```

となります。

```javascript
// アイテムごとの値をセット
elem_list_item.line_data = data[i];
// タップ時の動作を設定(詳細画面へ遷移)
elem_list_item.addEventListener('click', this.onClickListItem, false);
```

この部分に関しては次の削除機能で使用するものですがこの段階で追加しておきます。TODOの一行ごとにSQLで取得したデータを保持させます。削除時にはそのデータの中の`id`の値を使用して削除条件の絞り込みを行います。

このままだとアプリ実行時に`this.onClickListItemという関数が存在しない`というエラーが発生するため、いったん仮で関数を作成しておきます。`dispTodoList`の下に追加してください。

```javascript
dispTodoList : function(data) {
    // ...省略
},

/**
 * アイテムタップ時の処理。
 */
onClickListItem : function() {
    console.log('item tapped');
}
```

**これでアプリ起動時の一覧の初期化処理が完成しました！**
ソースに問題が発生していないことを確認してから仮想端末で起動してみましょう!(^^)!

<!-- 一覧が生成される画面 -->

ちゃんと表示されているでしょうか??
スクロールしても画面下の入力項目とボタンは下に張り付いていることも確認できますね( 一一)

表示するデータが少ない場合は、**まだ登録完了時に一覧を更新する処理は追加していないので、**十分な件数を登録してからアプリを再起動してください。増えていることが確認出来たら次に進みましょう。

また、TODOをタップしてみてVSCode上のデバッグコンソールにログが表示されることも確認してください。後でここに削除処理を追加します。


#### 登録後に一覧を再作成
最後に、登録成功時に一覧を更新する処理を追加します。登録成功時に再度データの取得と一覧の作成を行います。

`dispTodoList`の処理を一部追加します。

```javascript
dispTodoList : function(data) {
    var elem_list = document.getElementById('list');    // <ons-list id="list">を取得

    elem_list.textContent = null;   // この行を追加(一覧の子要素を全削除)

    for (var i = 0; i < data.length; i++) {
    // ...
}
```

一覧作成時にすべての一覧の子要素(`<ons-list-item>`)を削除します。これを追加しない場合、登録のたびにどんどん一覧が膨れ上がってしまいますorz

`element.textContent`でHTMLの要素のタグ内の値を参照することができます。`innerHTML`でも同じような感じでタグ内の値を参照できますが、こちらはHTMLソースがそのまま帰ってきます。

例えば、

```html
<ons-list id="list">
    <ons-list-item>aaa</ons-list-item>
    <ons-list-item>bbb</ons-list-item>
    <ons-list-item>ccc</ons-list-item>
</ons-list>
```

とある場合、`document.getElementById('list').textContent`の値は、`aaabbbccc`という感じになります。

一方で`document.getElementById('list').innerHTML`は、`<ons-list-item>aaa</ons-list-item><ons-list-item>bbb</ons-list-item><ons-list-item>ccc</ons-list-item>`という感じです。

これに`null`をセットすることで子要素を消し飛ばすことができるのでそれを使用します。

[https://qiita.com/kouh/items/dfc14d25ccb4e50afe89:embed]

<br>
***
<br>

次に登録成功時の処理を追加します。ただここで若干の問題が、、、(笑)
とりあえずソースです。`onClickRegisterButton` > `this.execInsertSql(values).then()`内の処理を変更します。

```javascript
this.execInsertSql(values)
    .then(function() {
        // 成功時
        this.dispNoTitlePopup('登録しました!');
        elem_input.value = '';  // 入力項目を空にする

        /** ここを追加 */
        this.getRegisteredData()
            .then(function(ret) {
                this.dispTodoList(ret);
            }.bind(this))
        /** ここまで */
    }.bind(this))
```

これで表示はできます。が、**Promiseのチェーン内に別のPromiseチェーンが発生してしまっています。**

一番すっきりしている形としては、

```javascript
this.execInsertSql(values)
    .then(this.getRegisteredData())
    .then(function(ret) {
        // 成功時
        this.dispNoTitlePopup('登録しました!');
        elem_input.value = '';  // 入力項目を空にする
        this.dispTodoList(ret);
    }.bind(this))
```

と書いて、SQLの結果を待ってから成功時の処理とすればいいのですが、今回使用しているデータベース操作用のモジュールのSELECT文を実行時にコールバック関数で実装されていることが原因でうまく非同期処理にできないようです。

2つ目の理想的なソースの形で処理の順番を追ってみると、`getRegisteredDataのSQL実行前までの処理` > `dispTodoListなどの実行` > `getRegisteredDataのSQL実行`
というわけのわからない順番で実行されてしまうので、SQLの実行結果をうまく使用できません。

とりあえず回避はできるので、ソースはブサイクですがこれで実装します。次に別のアプリなんかを作るときには要注意ですね。。。orz

<br>
***
<br>

では動作確認しましょう。仮想端末を再起動してデータを登録してみましょう。

<!-- 登録結果のポップアップと一覧の更新 -->

ポップアップの表示と同時に一覧が更新されているのが確認できると思います。以上で今回は終了です ^^) _旦~~


### 最後に
これで大分TODOアプリっぽくなりました！でも肝心の完了(削除)機能がまだ実装できていないので**やるべきことが溜まっていくだけのアプリ**になってしまっています(笑)

残すところその完了機能だけなのであと少しです(*´з`)


### 次の記事
削除処理の実装
[https://www.taneyats.com/entry/cordova-app-10:embed]
