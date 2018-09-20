# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(8 - 登録画面の作成)

### 前の記事

### 登録画面へのボタンを作成
#### ons-fab
登録用のボタンには`ons-fab`を使用します。Twitterとかであるような**画面下に固定(浮遊)しているボタン**ですね！

[https://ja.onsen.io/v2/api/js/ons-fab.html:embed]

コードはそのままですが、以下のように`list.html`を修正します。
`<!-- 新規登録ボタン -->`の部分を追加します。

```html
<ons-page id="list.html">
    <ons-toolbar>
        <div class="left"></div>
        <div class="center">タイトル</div>
        <div class="right">
            <ons-button modifier="quiet">
                <ons-icon icon="fa-bars">
            </ons-button>
        </ons-icon></div>
    </ons-toolbar>

    <ons-list id="list">
        <ons-list-header>一覧です。</ons-list-header>
    </ons-list>

    <!-- 新規登録ボタン -->
    <ons-fab id="register-button" class="button--fab" position="bottom right">
        <p><ons-icon icon="md-plus"></ons-icon></p>
    </ons-fab>
</ons-page>
```

すると右下のようにボタンが追加されます。下に表示されている行をクリックしてみるとボタンが浮いているのがよくわかりますね！('ω')

<!-- ons-fab.png -->

`icon="md-plus"`の部分を変更すれば表示されるアイコンを変更できます。


#### CSSで見た目を変更
このままだと背景色と同じで目立たないので色を変更します。

`index.css`の末尾に以下のように追記してください。

```css
.button--fab {
    background-color: #0076ff;  /* 背景色 */
    color: white;               /* 文字色 */
}
```


背景色などは好きな値を指定してOKです。上記ソースで指定している色はデフォルトの`ons-button`の色と同じです。(変数化されていないのでライブラリ内から探しました)

マテリアルデザインのガイドラインに反することになると思いますが、現状ではボタンが何となく小さいと感じたので大きさを画面幅にしてみます。今のままでいいという方は上のCSSで大丈夫です。
以下のCSSに置き換えることで可変にできます。

```css
.button--fab {
    width: 20vw;
    height: 20vw;
    background-color: #0076ff;
    color: white;
}

ons-fab > span > p {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    line-height: 20vw;
    font-size: 8vw;
}
```

内部の要素を上下左右中央に揃えるよくあるやり方ですね。ボタンの`width`と`height`, pの`line-height`は揃えるようにしてください。

<!-- ons-fab-color.png -->

ボタンはこれで完成です。仮想端末では若干タップ時のリップルエフェクトが変ですが、実機では問題ない(はず)です。('ω')


#### 画面遷移を追加
ボタンができたので、ボタンを押したときに登録画面へ遷移する処理を追加します。`list.html`の画面上にボタンがあるので、`list.js`に処理を追加します。その前に空の`register.html`を追加しておきます。

`list.html`あたりをコピーして、同じ場所に以下のように作成してください。とりあえず画面遷移できるかを確認するために、タイトルに登録画面とわかるようにしておきます。

```html
<ons-page id="register.html">
    <ons-toolbar>
        <div class="left"><ons-back-button></ons-back-button></div>
        <div class="center">登録画面</div>
        <div class="right">
            <ons-button modifier="quiet">
                <ons-icon icon="fa-bars">
            </ons-button>
        </ons-icon></div>
    </ons-toolbar>
</ons-page>
```

あとは、`list.js`にボタン押下時の処理を追加します。onclickイベントに処理を追加します。

```javascript
var js_list = {
    
    /**
     * ページ表示時の処理
     */
    init : function(page) {
        // ボタンに登録画面への遷移を設定
        var elem_btn = document.getElementById('register-button');      // ボタンの要素を取得
        elem_btn.addEventListener('click', this.onClickRegisterButton); // 処理を指定

        // ... (以下以前作成した一覧を表示する処理)

    },

    /**
     * 登録ボタン押下時の処理
     */
    onClickRegisterButton : function(event) {
        // 登録画面へ遷移
        document.getElementById('navi').pushPage('register.html');
    },
}
```

以前に作成した一覧を表示するための処理はいったんそのままで大丈夫です。登録処理が完成したら、その部分をデータベースの値からとってくるように書き換えます。

`<ons-navigator>`要素に`pushPage()`というページ遷移用の関数があるのでそれを利用
します。引数に渡したIDを持つ`<on-page>`へと遷移します。

<!-- register-screen -->

端末上で動作を確認してみると、ただ切り替わるだけでなくいい感じに画面がふわっと表れてくれると思います。**遷移先の画面左上にある(はずの)、戻るボタンを押して一覧画面へもどれることも確認しておいてください。**

これで遷移部分は完成です！


### 登録画面の作成
#### 画面レイアウト
|No.|項目名|形式|備考|
|---|---|---|---|
|1|タイトル|入力項目(1行)||
|2|詳細情報|入力項目(複数行)||
|3|重要フラグ|ON/OFFスイッチ|ONで重要アイテムに(背景色変更)|
|4|緊急フラグ|ON/OFFスイッチ|ONで緊急アイテムに(背景色変更 & 最上部に常に表示)|

最後の二つは公式サイトのサンプルを見て真似してみました。とりあえず登録項目とデータベースには追加しておきますが、実際に使うか(便利か)どうかは不明です。。。(笑)

以下の内容で何となくの登録情報入力画面ができます。

```html
<ons-page id="register.html">
    <ons-toolbar>
        <div class="left"><ons-back-button></ons-back-button></div>
        <div class="center">情報を入力してください</div>
        <div class="right"></div>
    </ons-toolbar>
    <ons-list>
        <!-- タイトル -->
        <ons-list-item modifier="nodivider">
            <ons-input id="title" class="input" placeholder="タイトル(50文字まで)" float></ons-input>
        </ons-list-item>

        <!-- 詳細内容 -->
        <ons-list-item modifier="nodivider">
            <textarea id="detail" class="textarea input" rows="6" placeholder="内容"></textarea>
        </ons-list-item>
    </ons-list>
        
    <ons-list>
        <ons-list-header>オプション</ons-list-header>
        <!-- 重要フラグ -->
        <ons-list-item>
            <div class="center">重要なTODO</div>
            <div class="center">
                <ons-button id="inportant-info" modifier="quiet">
                    <ons-icon size="20px" icon="md-info"></ons-icon>
                </ons-button>
            </div>
            <div class="right">
                <ons-switch id="important"></ons-switch>
            </div>
        </ons-list-item>

        <!-- 緊急フラグ -->
        <ons-list-item>
            <div class="center">緊急なTODO</div>
            <div class="center">
                <ons-button id="urgent-info" modifier="quiet">
                    <ons-icon size="20px" icon="md-info"></ons-icon>
                </ons-button>
            </div>
            <div class="right">
                <ons-switch id="urgent"></ons-switch>
            </div>
        </ons-list-item>
    </ons-list>

    <!-- 登録ボタン -->
    <ons-bottom-toolbar modifier="transparent">
        <div class="center">
            <ons-button id="submit" class="button--normal">登録</ons-button>
        </div>
    </ons-bottom-toolbar>
</ons-page>
```

`index.css`には以下の一つを追加してください。

```css
.input {
    margin-bottom: 20px;
    width: 90vw;
}
```

こんな感じの画面になります。

<!-- register-scr.png -->

入力フォーム要素の横幅を90%に指定したぐらいで、あとはOnsenUIのデフォルトのままです。色合いが若干気に入らない箇所がいくつかありますが、、、(笑)

`ons-list`など今までに使った部分もありますが、ちょっと解説です。

##### ons-input
```html
<ons-list>
    <!-- タイトル -->
    <ons-list-item modifier="nodivider">
        <ons-input id="title" class="input" placeholder="タイトル(50文字まで)" float></ons-input>
    </ons-list-item>

    <!-- 詳細内容 -->
    <ons-list-item modifier="nodivider">
        <textarea id="detail" class="textarea input" rows="6" placeholder="内容"></textarea>
    </ons-list-item>
</ons-list>
```

これでタイトルの入力項目と、詳細情報の入力項目(テキストエリア)を作成します。

`ons-input`の属性に`placeholder`と値を設定することによって、**input内に**項目の説明を加えることができます。さらに`float`属性を指定することで、**文字入力があった場合に上に移動してくれます。**なんかかっこいい！

かつ入力状態でも項目の説明を見ることができるので、なんの項目か確認できますね。よくある入力フォームではプレースホルダが隠れてしまってなんの項目かわからないという場面をしばしば見ますが、それを回避できます。(テキストエリア形式では残念ながら対応できてませんが)

idは登録時に値を取得するために必要なため、必ず指定してください。


### ons-switch
```html
<ons-list-item>
    <div class="center">重要なTODO</div>
    <div class="center">
        <ons-button id="inportant-info" modifier="quiet">
            <ons-icon size="20px" icon="md-info"></ons-icon>
        </ons-button>
    </div>
    <div class="right">
        <ons-switch id="important"></ons-switch>
    </div>
</ons-list-item>
```

`ons-list-item`内では`<div class="left/center/right"`を指定することで、要素を指定の場所に固めることができるようです。なので項目名称を左(中央)に、スイッチを右にと固めることができます。

設定したボタンは、後々JavaScriptから「オンにした場合にどうなるか？(背景色変更されるとか)」の説明を付加します。若干ずれているのがすごい気になりますが、見なかったことにしましょう。


##### ons-bottom-toolbar
```html
<ons-bottom-toolbar modifier="transparent">
    <div class="center">
        <ons-button id="submit" class="button--normal">登録</ons-button>
    </div>
</ons-bottom-toolbar>
```

`ons-bottom-toolbar`を使うと、**画面下に張り付くような要素**を作成することができます。HTMLとCSSで作ろうとするとpositionをabsoluteにして、、、topとbottomを0にして、、、とするアレですね。便利です。

属性`modifier="transparent"`を指定することで、ツールバーの背景を透明にすることができます。その上にボタンを配置するような感じです。

とりあえず画面はできたのでいったんこの記事は完了です。お疲れさまでした ^^) _旦~~

次の記事ではJavaScriptでの処理(テーブル作成～入力情報の取得など)を追加していきます。

### 次の記事
JavaScript処理を追加する
