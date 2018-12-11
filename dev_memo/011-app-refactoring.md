# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(11 - 一部手直しなど)
こんにちは、たねやつです。

前回までの部分でアプリの基本的な機能の作成に関しては完了しているのですが、今回はちょっとしたコードや見た目の修正を行います。どうでもいいという場合はすっ飛ばしても問題ありません。



### 前の記事
[https://www.taneyats.com/entry/cordova-app-10:embed]

### コーディング
#### ソースの並び順を変更
不要だった処理や関数の並びを整えることによって、後からソースを見たときにわかりやすくします。

##### index.js
特に現状修正することはありませんが、結局画面は`list.html`の一つになってしまったため分岐の部分で不要なページへの判定が残っている場合は削除しておきましょう。

```javascript
// button.htmlページの処理
if (page.id === 'button.html') {

} else if (page.id === 'list.html') {
    js_list.init(page);

} else if (page.id === 'sqltest.html') {
    js_sqltest.init(page);
}
```

↓

```javascript
if (page.id === 'list.html') {
    js_list.init(page);
}
```


##### list.js
個々の機能で作成した関数たちをある程度ジャンルによってまとめます。今回であれば以下の種類に分けることができます。

- 初期化処理
  - `init`
- 一覧表示用の関数
  - `dispTodoList`, (`getRegisteredData`)
- イベントフック時の関数
  - `onClickRegisterButton`, `onClickListItem`, (`onCloseConfirmPop`)
- ポップアップ用の関数
  - `dispNoTitlePopup`, (`onCloseConfirmPop`)
- SQL実行の関数
  - (`getRegisteredData`), `execInsertSql`, `execUpdateSql`
- チェック用の関数
  - `checkError`

あたりに分けることができます。`getRegisteredData`など複数のジャンルにまたがるような処理もありますのでお好きな分け方をしておいてください。また**関数名を変更した場合**は対象の関数名を右クリックして`シンボルの名前を変更`を選択すると一括で関数名だけ置換できますので便利です。

##### index.css
コチラもある程度ジャンルや適応範囲にまとめておくとあとから探しやすかったりします。私の場合は`root` -> `要素` -> `クラス` -> `id` の順で並べるようにしています。プロパティの並び順に関しては以下の記事が参考になります。

[http://unitopi.com/css-order/:embed]

いろんなソースを見た感じ、Mozzila方式の記述法がポピュラーな印象です。

今回追加したCSSはそこまで多くはないのですが、出てきた順に追加している場合は以下のようになっているはずなので一応修正しておきましょう。`body`から`.blink`‘まではもとから用意されているものなので特にいじらずにそのまま置いておきます。

```css
ons-list-item {
    text-transform: none;
}

.center {
    text-align: center;
}

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

↓

```css
ons-list-item {
    text-transform: none;
}

ons-bottom-toolbar {
    height: 3em !important;
    text-align: center;
}

.center {
    text-align: center;
}

/* 入力項目 */
.input-title {
    margin-top: 4%;
    width: 85%;
}
```

ほぼ変更なしです(笑)


#### アプリの見た目変更
##### 一覧画面のトップ部分の表示文字列を変更
現在は`TODO LIST`と表示していますがここの表示内容を変更するには`list.html`の以下の部分を修正します。

```html
<ons-page id="list.html">
    <ons-toolbar>
        <div class="left"></div>
        <div class="center">TODO LIST</div> <!-- ここを修正 -->
        <div class="right"></div>
    </ons-toolbar>

    <!-- ... -->
```

`class="left, right"`の行は削除しても問題ないです。メニューなどのボタンをこの要素内に設定するといい感じの割合でツールバー上に表示してくれます。


##### 入力項目の余白
入力項目が画面左端にかなり近く見栄えが良くないので修正します。`input-title`に`margin-left`を追加します。`2vw`ぐらいにしておくといい感じに離れて見えます。

```css
/* 入力項目 */
.input-title {
    margin-top: 4%;
    margin-left: 2vw;
    /* margin: 4% 0 0 2vw; でも可 */
    width: 85%;
}
```


##### TODOがない場合の表示
現状一覧に何もない状態だとまっさらで何も表示されないので何か表示させてみます。`dispTodoList`に修正を加えます。

```javascript
/**
 * 取得した値で一覧を作成します
 * @param {Array} data 取得した値
 */
dispTodoList : function(data) {
    var elem_list = document.getElementById('list');    // <ons-list id="list">を取得
    
    elem_list.textContent = null;   // 子要素を全て削除

    /** ここから追加 */
    // 登録データが0件の場合
    if (data.length == 0) {
        var elem_list_item = document.createElement('ons-list-item');
        elem_list_item.classList.add('list-empty');
        elem_list_item.innerHTML = 'Nothing to do now...';
        elem_list.appendChild(elem_list_item);
        return;
    }
    /** ここまで追加 */
    // ...
},
```

SQLで取得できたデータが0件の場合に、専用の`ons-list-item`を作成してそれだけを表示させて処理を抜けます。`element.classList.add`で要素に指定するクラスを追加することができます。

CSSに以下を追加してください。

```css
.list-empty {
    height: 100%;
    background: lightgray;
    color: gray;
}
```

これでTODOのリストの要素を全部削除すると以下のような感じに表示されます。

<!-- 件数0の時の画面 -->
<div class="center">
    <a data-flickr-embed="true"  href="https://www.flickr.com/photos/153853557@N08/44456717220/in/dateposted-public/" title="件数0の時の画面"><img src="https://farm5.staticflickr.com/4828/44456717220_c6d1e93719_c.jpg" width="450" height="800" alt="件数0の時の画面"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
</div>

高さを調節して全体的に表示したかったのですが、ツールバーをのぞいた部分の高さをどうしても取得できないため断念。。。


##### エンター入力時に登録実行
入力項目にタイトルを入力したのちに、キーボード上のエンターキーを押しても登録が実行されません。HTMLのフォームだと普通は登録などの次の処理が実行されるのでそれっぽい動きをするようにします。

まずは入力項目に処理を追加します。

```javascript
init : function(page) {
    // 入力項目に処理を追加
    var elem_input = document.getElementById('input-title');
    elem_input.addEventListener('focus', this.onFocusInputTitle.bind(this), false);
    elem_input.addEventListener('blur',  this.onBlurInputTitle.bind(this),  false);

    // 登録ボタンに処理を追加
    var elem_reg_btn = document.getElementById('register-button');
    elem_reg_btn.addEventListener('click', this.onClickRegisterButton.bind(this), false);

    // ...
},
```

`init`の部分に登録ボタン押下時の処理があるので、順番的にその前に追加します。**入力項目が入力状態(focusが当たった状態)の時と、フォーカスが外れた時**に処理を追加します。

指定している関数の中身は以下のような感じです。

```javascript
/**
 * 入力項目にフォーカスしたときの処理。
 */
onFocusInputTitle : function() {
    document.addEventListener('keydown', this.onKeyDown);
},

/**
 * 入力項目のフォーカスが外れたときの処理。
 */
onBlurInputTitle : function() {
    document.removeEventListener('keydown', this.onKeyDown);
},
```

`onFocusInputTitle`では、`keydown`イベント発生時に`onKeyDown`という関数を実行するように設定しています。`keydown`イベントはキーボードのキーのいずれかが押されたときに毎回発生します。

`onBlurInputTitle`ではその逆で、`keydown`イベントに設定した`onKeyDown`という関数を除去しています。もし除去しないままにしておくと、**入力項目にフォーカスが当たるたびに**`onKeyDown`**関数が追加されます。**そうなってしまうと、例えば3回フォーカスした後にデータをエンターキーで登録すると3データ文登録されることになってしまいます。

`onKeyDown`の内容はこんな感じです。

```javascript
/**
 * キー入力に関する処理。
 */
onKeyDown : function(event) {
    if (event.keyCode == 13) {
        // Enterキー押下時
        document.getElementById('register-button').click(); // 登録ボタンを押下
        event.target.blur();    // フォーカスを外す
        event.preventDefault(); // 元の動作を無効化
    }
},
```

`event.keyCode`で入力されたキーボードのキー番号を参照できます。

[http://faq.creasus.net/04/0131/CharCode.html:embed]

エンターキーは`13`なのでその時だけ登録ボタンのクリック処理を追加します。今まで知らなかったのですが`element.click()`で疑似的にクリックしたことにできるんですね(*´з`)

これで入力中にエンターキーを押すと登録できるようになりました！


##### その他
チェックボックスを追加して一度に複数削除するとか、上のタイトルの部分に残っているTODOの個数を表示させるとか追加できそうな機能はいくらでもあるのですが、今回は省略します。とりあえずは基本的な部分だけでもアプリとして完成させてしまいましょう!


### 最後に
今回はちょっとした手直しだけでした。おそらく次回が最後の記事になると思われます(*´з`)

最後の記事ではアプリをビルドして、実機で動作させてみます。

### 次の記事
アプリのビルド
[https://www.taneyats.com/entry/cordova-app-12:embed]
