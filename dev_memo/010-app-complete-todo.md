# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(10 - 登録したデータを削除する)
こんにちは、たねやつです。今回もアプリ作成を進めていきましょう！

今回はいよいよ最後の処理となる、TODOの完了(削除)機能となります。この機能を追加すればTODOリストのアプリとして最低限の機能を備えたアプリになります。

### 前の記事
[https://www.taneyats.com/entry/cordova-app-9:embed]


### 目標
- SQLについて理解を深める
- 確認用ポップアップが使えるようになる。

確認用ポップアップだけが今回の新しく学ぶ内容となります。SQLの概要の部分ですでに削除処理(更新処理)はやっているので大丈夫でしょう。

### コーディング
#### 削除のタイミング
削除機能を実行する方法ですが、無難に対象のTODOをタップしたときにしておきます。もともとの構想ではタップしたときには詳細画面へ遷移してTODOのより詳しい情報を表示させたりしようとしていましたがシンプルさを求めた結果そぎ落とされました( 一一)

前回の処理の中ですでにタップ時の処理は追加済みです。`onClickListItem`という関数が各TODOに対してタップ時の関数に埋め込まれています。ここに処理を追加していきます。


#### 確認用ポップアップの表示
タップして即削除としてしまうと誤操作時にも削除されてしまうので、確認用のポップアップを一つ挟みます。

ポップアップに関してすでに`ons.notification.alert`を何度も使っているのですがこれは**OKボタンしかないただの表示用のポップアップです。**

`ons.notification.confirm`を使用すればYES/NOの選択肢付きのポップアップを表示することができます。

[https://ja.onsen.io/v1/reference/ons.notification.html#method-confirm:embed]

<br>
***
<br>

それではソースを変更していきます。`list.js`の現在デバッグ分だけが仕込まれている`onClickListItem`の関数の処理を変更します。

```javascript
/**
 * アイテムタップ時の処理。
 */
onClickListItem : function(event) {
    ons.notification.confirm({
        title: '',
        message: 'このTODOを完了しますか?',
        callback: (answer) => this.onCloseConfirmPop(answer, event),
    })
},
```

`onClickListItem`の引数として`event`を設定します。これでクリックイベント発生時にいろいろな値が取得できるようになります。その中から後で**タップしたDOM要素**を取得します。

`title`と`message`のキーは普通のポップアップと同じですが、`callback`というキーをあたらに追加しています。(alertの場合でも実は追加できますが)

ここに指定している関数がポップアップが閉じられるときに実行されます。**この関数の引数にしている変数に確認用ポップアップの場合は、OKをたっぷしたのかCANCELをタップしたのかを判定するための値が渡されます。**CANCELをタップした場合には`0`が渡されるのでそれを判定します。(公式ドキュメントには`-1`が返ってくるとありますが間違いですね)

`callback`にしている関数には[アロー関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions#Description)を使用しています。これを使用することで`.bind(this)`せずともthisを束縛することができます。

`function()`を使用して書くと以下のようになります。

```javascript
callback: (answer) => this.onCloseConfirmPop(answer, event),

callback: function(answer) {
    this.onCloseConfirmPop(answer, event),
}.bind(this),
```

記述量がかなり減りますし、thisの束縛を書かなくてもいいのですっきりしますね!

`onCloseConfirmPop`の関数は以下のような感じです。`onClickListItem`の下に追加してください。

```javascript
onClickListItem : function() {
    // ...
},

/**
 * 確認用ポップアップを閉じる時の処理。
 * @param {Number} answer [CANCEL]を選択した場合-1
 */
onCloseConfirmPop : function(answer, event) {
    if (answer <= 0) {
        // [OK]押下時の処理
        console.log('OK clicked');
    } else {
        // [CALCEL]押下時の処理
        console.log('CANCEL clicked');
    }
}
```

また、元画面からの`this`を渡してくる必要があるので、`dispTodoList`の一部を書き換えます。

```javascript
// タップ時の動作を設定(詳細画面へ遷移)
// elem_list_item.addEventListener('click', this.onClickListItem, false);
elem_list_item.addEventListener('click', this.onClickListItem.bind(this), false);
```

`this.onClickListItem`に`.bind(this)`を追加します。この`this`を一子相伝的に渡していく方法はちょっと次のアプリを作る際に反省しないといけないですね。。。

<br>
***
<br>

これで処理はいったんOKですので仮想端末を起動して動作確認を行います。ポップアップが表示されてOKを押したとき、CANCELを押したときにそれぞれデバッグコンソールにログが出力されていることを確認出来たらOKです。

<!-- 確認のポップアップが表示されている画面 -->
<div class="center">
    <a data-flickr-embed="true"  href="https://www.flickr.com/photos/153853557@N08/45542822914/in/dateposted-public/" title="確認のポップアップが表示されている画面"><img src="https://farm2.staticflickr.com/1977/45542822914_3081262d43_c.jpg" width="450" height="800" alt="確認のポップアップが表示されている画面"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
</div>


#### 削除処理
次に削除処理を追加します。削除処理といってもSQL文を実行するだなのですが( 一一)

今回のデータベースのテーブル構造には`valid`というデータの有効/無効を判定するためのカラムが存在しています。一覧を取得する際も`WHERE valid = 1`のデータだけを抽出して表示させています。このような構造にしておくと**削除済みデータも参照できるといった利点があります。**一方でデータ件数が延々と膨れ上がってしまうという点もありますので**そのデータを復元したり再度参照したりするのかよく考えて設計する必要があります。**

今回は後々の拡張性(完了済みのTODOを参照する機能など)も考えてこのような構造を持っています。ですので削除するときには`valid = 0`に更新してあげるだけです。DELETE文は使用しません。実行するようなSQLはこんな感じです。

```sql
UPDATE todo SET valid = 0 WHERE id = [選択したデータのid];
```

<br>
***
<br>

それではコーディングです。`onCloseConfirmPop`の中身を修正します。まずは**一覧作成時に埋め込んだidの値を取得する必要があります。**

ここで一つ問題となるのですが、TODOをタップしたときに**行の文字列をタップしたか、空白の部分をタップしたかで**`event.target`に入る要素が変わってきます。一覧作成時に実際に作成されるHTMLソースは(おそらく)以下のような感じになっています。

```html
<ons-list>
    <ons-list-item>
        <div>アプリで表示される文字列</div>
    </ons-list-item>
    ...
</ons-list>
```

ですので、**文字列をタップしたときには**`<div>`、**余白をタップした場合には**`<ons-list-item>`が取得できます。今回`id`などの値を埋め込んだのは`<ons-list-item>`なのでそちらが取れないと処理を進めることができません。

回避方法として2パターンあり、

- `<div>`のタップイベントを無効化する。 
- `event.target.line_data`がない場合、`event.target.parentElement.line_data`を参照するようにする。

があるかと思います。`<div>`のタップを無効化することで親要素の`<ons-list-item>`のタップイベントが実行されるようになります。

前者の場合、以下のようなソースとなります。

```javascript
/**
 * 確認用ポップアップを閉じる時の処理。
 * @param {Number} answer [CANCEL]を選択した場合0
 */
onCloseConfirmPop : function(answer, event) {
    if (answer <= 0) return;    // [CANCEL]押下時は何もしない
    
    var id = event.target.line_data.id;    // 一覧作成時に埋め込んだidの取得
}
```

追加でCSSから`<div>`のイベントを無効化するようにします。`<ons-list-item>`内の`<div>`には`list-item__center`というクラスが付与されているのでそれを利用します。

```css
.list-item__center {
    pointer-events: none;
}
```

後者の場合はJavaScriptだけで完結できます。

```javascript
/**
 * 確認用ポップアップを閉じる時の処理。
 * @param {Number} answer [CANCEL]を選択した場合0
 */
onCloseConfirmPop : function(answer, event) {
    if (answer <= 0) return;    // [CANCEL]押下時は何もしない
    
    var line_data   = event.target.line_data || event.target.parentElement.line_data;
    var id          = line_data.id;
}
```

JavaScriptでは変数の代入時に`||`を使用することで**前の値がundefinedの場合、後ろの値を代入するようになります。**なので現在要素に`line_data`が存在している場合それを使用し、存在していない場合は親要素の`line_data`を使用するようになります。今回はコチラの方法を使います。

<br>
***
<br>

idが取得できたらSQLでUPDATE文を実行できるようになります。以下のようにして処理を追加します。

```javascript
/**
 * 確認用ポップアップを閉じる時の処理。
 * @param {Number} answer [CANCEL]を選択した場合0
 */
onCloseConfirmPop : function(answer, event) {
    if (answer <= 0) return;    // [CANCEL]押下時は何もしない
    
    var line_data   = event.target.line_data || event.target.parentElement.line_data;
    var id          = line_data.id;
    if (id == null) return;

    this.execUpdateSql(id);
},

/**
 * UPDATE文を実行します。
 * @param {Number} id 更新対象のデータのid
 */
execUpdateSql : function(id) {
    var update_sql = 'UPDATE todo SET valid = 0 WHERE id = ?';
    var vals = [id];

    return new Promise(function(resolve, reject) {
        db.transaction(function(tx) {
            // 実行部分
            tx.executeSql(update_sql, vals);
        }, function(error) {
            // SQL処理エラー発生時の処理
            console.log('更新処理失敗 : ' + error.message);
            reject();
        }, function() {
            // SQL処理成功時の処理
            console.log('更新処理成功');
            resolve();
        })
    })
}
```

処理の感じはINSERT文を実行したときと同じような感じになります。実際に動かしてみてデバッグ文の確認や、例によってまだ一覧の更新は実装していないので**アプリを再起動したときに消えているか**を確認してください！


#### 削除の後処理
##### 成功のポップアップ
まずは削除できたことを表すポップアップを追加します。先ほどのSQLを実行する関数はPromise型の値を返すのでそれを利用して分岐します。

```javascript
/**
 * 確認用ポップアップを閉じる時の処理。
 * @param {Number} answer [CANCEL]を選択した場合0
 */
onCloseConfirmPop : function(answer, event) {
    if (answer <= 0) return;    // [CANCEL]押下時は何もしない
    
    var line_data   = event.target.line_data || event.target.parentElement.line_data;
    var id          = line_data.id;
    if (id == null) return;

    this.execUpdateSql(id)
        .then(() => {
            this.dispNoTitlePopup('完了しました!');
        })
        .catch(() => {
            this.dispNoTitlePopup('完了処理に失敗しました...');
        })
},
```

再度アロー関数を使用しています。**一つのプロジェクト内で同じ処理の表記ぶれ(function(){}.bind(this)かアロー関数か)はご法度ですが**勉強のためにもアロー関数で書いてみましょう('ω')


##### 一覧の更新
最後に一覧の更新です。これが完了すればアプリの処理部分は完成です！

```javascript
this.execUpdateSql(id)
    .then(() => {
        this.dispNoTitlePopup('完了しました!');
        this.getRegisteredData().then((ret) => this.dispTodoList(ret));
    })
    .catch(() => {
        this.dispNoTitlePopup('完了処理に失敗しました...');
    })
},
```

一行だけの追加となります。登録成功時に一覧を更新するときと同じ処理になります。それをアロー関数で書き直すとこんな感じになります。アロー関数では実行する処理が一行分の場合カッコ`{}`を省略できます。

これで処理に関する部分は完了です。仮想端末を起動して動作を確認しましょう(;'∀')

登録、削除、登録と行っても一覧の状態は正常であるかを確認してください。途中でおかしくなる場合やコンソールに何かしらのエラー文が表示される場合は手直しが必要です。登録処理のデバッグを行ったように例外が発生している場所などを抽出したりして行ってください。

以上で今回は終了です!お疲れさまでした ^^) _旦~~


### 最後に
処理的には今回はそこまで難易度は高くありませんでした。そしてようやくアプリの基本動作を作り終えたことになります！

登録と削除ができた感じどうでしょうか？自分で作ったものが動くと本当にうれしいですよね('ω')

次回以降はちょっとした手直しやアプリをビルドしてスマホで動作確認などを行っていきたいと思います。


### 次の記事
ソースや見た目の手直し
[https://www.taneyats.com/entry/cordova-app-11:embed]
