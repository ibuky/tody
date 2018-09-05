# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(5 - 静的な一覧画面の作成)

### 前の記事
OnsenUIの導入

### 目標
- `<ons-*>`タグの使い方を理解する。
- 値を直にHTMLに指定して、一覧を作成することができるようになる。
- JavaScriptから一覧を作成することができるようになる。
  (jsでのDOMの操作、For文の理解)


### ページを作成する
前回は、**ボタンをタップするとポップアップを表示する簡単な処理を作成**しましたが、今回は一覧画面を作成してみようと思います。

最終的には、**JavaScriptから任意の列数の一覧を生成**することができるようになるところまで紹介します。ぱっと聞いた感じ難しそうに聞こえるかもしれませんが、流れを理解できればそうでもないはずです！(*'ω'*)


#### ons-navigator
前回も出てきましたが、navigatorです。**ページの進む/戻るを管理するための要素で、一番最初のページを呼び出すためにも使用します。**

Cordovaではデフォルトでは、`index.html`が読み込まれてそこにいる`<ons-navigator>`で指定しているIDのページが表示されます。以下のように前回作成した`index.html`の`<body>`内を修正して`list.html`が読み込まれるようにしてください。`button.html`のファイルは今後使用しないので、削除してもOKです( 一一)

```html
<body>
    <ons-navigator id="navi" page="list.html"></ons-navigator>
</body>
```

便宜上、ファイル名と同じIDを指定していますがここは任意の値で構いません。そうした場合、あとで作成する`list.html`内の`<ons-page>`に指定するIDはここで指定した値と同じである必要があります。


#### ons-page, ons-list
次にページを作成します。`index.html`と同じ階層に`list.html`という名前のHTMLファイルを作成します。
中身は以下のような感じにします。

```html
<ons-page id="list.html">
    <ons-list>
        <ons-list-header>一覧のタイトル</ons-list-header>
        <ons-list-item>1行目</ons-list-item>
        <ons-list-item>2行目</ons-list-item>
        <ons-list-item>3行目</ons-list-item>
    </ons-list>
</ons-page>
```

`<ons-list>`は一覧を作成するための要素です。子要素に`<ons-list-item>`を追加することで、一覧の行数を増やしていくことができます。

試しに各値を変更してみたり、`<ons-list-item>`を追加してみたりしてください。(*'ω'*)

あと、以下のような子要素も追加してみてください！

```html
    <ons-list-item modifier="chevron" tappable>Item</ons-list-item>
```

<!-- list-tappable.png -->

どうでしょうか？少し見た目が変わりましたね！ついでにアイテムをタップしたときにエフェクトが表示されるようになりましたか？

`modifier="chevron"`を追加することで、アイテムの右側に`>`マークを追加します。これがあることによって**ユーザーにこの要素を触ると何か後続処理が実行される**という目印になります。

`tappable`属性を追加することでタップ(onclick)したときのエフェクトが追加されます。もともとonclickイベントは拾うことができるのですが、エフェクトが追加されることでより「触った」ことがわかりやすくなります。

※公式ドキュメントでは`modifier="chevron"`を追加するだけで`tappable`属性も有効になるような書き方をされていますが、各々個別に実装してやる必要があるようです。
[https://ja.onsen.io/v1/reference/ons-list-item.html:embed]


#### ons-toolbar
ところでここまで作ってみて、ほかのスマホアプリにあるような何かが足りないと感じませんか？

そうです！画面上部のタイトルや戻るボタンなどがないですね！最近はWEBページなんかでもスマホ用ページだと画面上部にくっついてくるようなあれです。(*'ω'*)

次はそれを追加してみましょう。使う要素は`<ons-toolbar>`です。

```html
<ons-toolbar>
    <!-- ツールバー中央の要素 -->
    <div class="left"></div>

    <!-- ツールバー中央の要素 -->
    <div class="center">ここにタイトル</div>

    <!-- ツールバー右側の要素 -->
    <div class="right">
        <ons-button modifier="quiet">
            <ons-icon icon="fa-bars"></ons-icon>
        </ons-button>
    </div>
</ons-toolbar>
```

この内容を、`<ons-page>...</ons-page>`内の`<ons-list>`より上においてみてください。以下のような画面になると思います。

<!-- list-toolbar -->

`<div>`のクラス`left/center/right`をそれぞれ指定することでいい感じに要素を配置してくれます。なのでここでは`center`にタイトル、`right`にメニューボタンを配置しています。(今後特にメニューは使う予定はないですがとりあえず配置してみました。)

`<div>`内の要素が空の場合は、詰めて表示されます。`left`の中には今後戻るボタンを配置する予定です。


#### ons-buttonをアイコンにする
上記ソース内の、

```html
<ons-button modifier="quiet">
    <ons-icon icon="fa-bars"></ons-icon>
</ons-button>
```

という風にすると**アイコンをボタン風にすることができます。**

ボタンに`modifier="quiet"`を指定することによってボタン背景色や影を透明化したボタンを作成することができます。

そのボタンに表示する文字としてアイコンを指定しています。`<ons-icon>`に`icon="fa-bars"`属性を指定するとメニューのアイコンが表示されます。

指定できるアイコンは、**Font AwesomeかGoogle Material Icons**となります。WEBページでよくお世話になるやつらですね(*'ω'*)

ほかにも指定できたはずですが、この二つを押さえておけば問題ないでしょう！

`icon=""`の値にアイコン名を指定します。**この時、Font Awesomeの場合は、接頭辞としてfa-、Material Iconsの場合はmd-をつけます。**
`fa-bars`はFont Awesomeから拾ってきたものです。Material Iconsを使用する場合は、`md-menu`となりますね。

使えるアイコンとアイコン名などは以下から参照できます。

[https://material.io/tools/icons/?style=baseline:embed]

[https://fontawesome.com/icons?d=gallery:embed]


### 動的に一覧を作成する
今度は、JavaScriptから動的に(指定した値で)一覧を作成してみましょう(*'ω'*)
お待ちかねのロジック部分ですね！
HTMLを書くのも楽しいですが、やはりjavaScriptのほうがプログラミングしている感は出ますよね！

ですがまずはHTMLから修正します。`list.html`の一覧の部分にIDをつけます。

```html
<ons-list id="list">
    <ons-list-header>一覧です。</ons-list-header>
</ons-list>
```

指定しておくとJavaScriptからのアクセスがぐっと楽になります。JavaScriptから処理をするような要素には基本的にIDを振っておきましょう。**IDにはほかの要素のIDと被らないようなユニークな値を指定する必要があることに注意してください。**

`<ons-list-item>`はJavaScriptで追加するようにするのでいったん全部削除してください。
逆に`<ons-list-header>`は変わらない値なのでHTML側に記述しておいてください。あまりいろんなところから子要素を追加してしまうとあとからメンテナンスが大変になったりしますがとりあえずはこのままで。

次に`index.html`にこれから追加するJavaScriptを読み込むために、

```html
<!-- 各処理読み込み -->
<script type="text/javascript" src="js/index.js"></script>
<script type="text/javascript" src="js/list.js"></script>
```

の下の行を追加します。`index.js`の下に追記しておくとまとまって見やすいと思います。

<br><br>

次にJavaScriptで処理を追加します。`button.html`を追加したときの処理が残っていると思いますので、そのまま追記します。

`index.js`を以下のようにします。

```javascript
document.addEventListener('init', function(event) {
    // 表示対象のページを取得
    var page = event.target;

    // button.htmlページの処理
    if (page.id === 'button.html') {

        // ...

    } else if (page.id === 'list.html') {
        js_list.init(page);
    }
});
```

多分今後使わないと思いますので、ボタン部分の処理は削除してしまっても問題ないです( ;∀;)
今回はページIDによって処理が分岐していることをテストするためにも残しています。

`list.html`用の処理の中には見たこともないような変数とメソッドが並んでいますが、これから作成します。

最後に`list.js`ファイルを作成します。作成するフォルダは`index.js`のあるフォルダと同じ場所にしてください。

中身はちょっと長いですが以下のような感じです。

```javascript
var js_list = {
    
    /**
     * ページ表示時の処理
     */
    init : function(page) {
        // 表示する文字列を指定(配列数だけ一覧が作成される)
        var disp_str = [
            '1行目です',
            '2行目です',
            '3行目です',
            '4行目です',
            '5行目です',
        ]
        
        // <ons-list id="list">を取得
        var elem_list = document.getElementById('list');

        /**
         * disp_strの数に応じて動的に一覧の作成
         */
        for (var i = 0; i < disp_str.length; i++) {
            // 空の<ons-list-item>を作成
            var elem_list_item = document.createElement('ons-list-item');

            // 属性を追加
            elem_list_item.setAttribute('modifier', 'chevron');
            elem_list_item.setAttribute('tappable', '');

            // 表示する値を追加
            elem_list_item.innerHTML = disp_str[i];

            /**
             * ここまでの段階では
             * elem_list_itemという変数に <ons-list-item modifier="chevron" tappable>n行目です</ons-list-item>
             * が作成されただけで、画面には表示されていない。
             * 表示させるためには、<ons-list id="list">の子要素に追加する必要がある。
             */

            // 親要素に追加
            elem_list.appendChild(elem_list_item);
        }


        /**
         * disp_strの数に応じて動的に一覧の作成(foreach)
         */
        disp_str.forEach(function(str) {
            // 空の<ons-list-item>を作成
            var elem_list_item = document.createElement('ons-list-item');
            
            // 属性を追加
            elem_list_item.setAttribute('modifier', 'chevron');
            elem_list_item.setAttribute('tappable', '');
            
            // 表示する値を追加
            elem_list_item.innerText = str + ' (forEachで追加)';
            
            // 親要素に追加
            elem_list.appendChild(elem_list_item);
        });
    }
}
```

まずは`js_list`という変数を宣言します。中身は連想配列で関数を追加していきます。

次に`init`というキーに関数を指定します。変数のような存在(キー)に関数を指定できるというのが最初は慣れないかもしれないですが、慣れると手っ取り早く関数を作り出せるこの感じが結構楽しいですね。

init関数に引数を指定(ons-page要素)していますが、今回は特に使用しません。今後使用する可能性がある(はず)なのでとりあえず渡しておきます。

ここで宣言したinitの関数は、別の処理から`js_list.init(arg)`の形で呼び出すことができます。先ほどの`index.js`で記述したやつですね！

<br><br>

それでは処理の中身の説明を進めていきます。基本的にはコメントに書いてある内容の深堀と補足です。

```javascript
// 表示する文字列を指定(配列数だけ一覧が作成される)
var disp_str = [
    '1行目です',
    '2行目です',
    '3行目です',
    '4行目です',
    '5行目です',
]
```

コメントのままです。JavaScriptでは最終値の後のコンマが残った状態でもエラーとならないので便利です。

<br>

```javascript
// <ons-list id="list">を取得
var elem_list = document.getElementById('list');
```

コメントのままです。`document.querySelector('#list')`でも同じ値を取得できますが、こっちのほうが若干遅いようです。

<br>

```javascript
/**
 * disp_strの数に応じて動的に一覧の作成
 */
for (var i = 0; i < disp_str.length; i++) {
    // 空の<ons-list-item>を作成
    var elem_list_item = document.createElement('ons-list-item');

    // 属性を追加
    elem_list_item.setAttribute('modifier', 'chevron');
    elem_list_item.setAttribute('tappable', '');

    // 表示する値を追加
    elem_list_item.innerHTML = disp_str[i];

    /**
     * ここまでの段階では
     * elem_list_itemという変数に <ons-list-item modifier="chevron" tappable>n行目です</ons-list-item>
     * が作成されただけで、画面には表示されていない。
     * 表示させるためには、<ons-list id="list">の子要素に追加する必要がある。
     */

    // 親要素に追加
    elem_list.appendChild(elem_list_item);
}
```

典型的(？)なfor文の書き方です。CやJavaでもこのような書き方でfor文を実行します。

`GetElementbyId`, `AddEventListener`, `createElement`, `setAttribute`, `appendChild`
あたりを使いこなすことができるようになれば基本的なDOM操作はできるようになったと言えると思います(*'ω'*)

コメントのままなので特に追記することがないです。。。(笑)

`appendChild`では追加した順に上から表示されるようになるので、もし逆順(5 -> 1だったり、登録日時の昇順/降順)で表示したい場合は渡す値を工夫する必要があります。

<br><br>

おまけで`forEach`を使用した場合の書き方も載せています。








### 次の記事
CSSを変更する

