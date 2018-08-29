# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(4 - OnsenUIの導入)

### 前の記事
仮想端末でのサンプルアプリの起動

### 目標
- OnsenUIを導入する
- 簡単な画面を作ってみる

### OnsenUIの導入
より簡単に、一貫したきれいな画面を作成するために今回は**OnsenUI**というUIの部品を集めたライブラリを使用します。

例えば、`<button>`を一つ作るにしても、Androidであればマテリアルデザインのガイドラインに従って作成するべきであるし、iOSであればiOSの流派に沿って作成しなければ**そのOSらしいアプリは仕上がりません。**

OnsenUIを導入して、`<ons-button>`という要素でボタンを作成することで、上記の(初心者にとっては)難解な規則をすべていい感じに各OSに合わせてくれます。なので開発者はデザインという部分に意識をあまり向けずにアプリの開発を行うことができます。

実際にどんな感じの部品が用意されているかについては以下のページを参照してみてください。

[https://ja.onsen.io/v2/api/css.html:embed]

どうでしょうか。いろんなアプリで見たことあるような部品がいっぱいありますね！**Material**とついているものはAndroidで表示した場合のイメージとなっています。
サンプルコードも記載されているので結構ここからコピーするだけでもアプリを作っていけるかもしれないですね(*'ω'*)


#### npmで取得
それでは導入を進めていきましょう！

OnsenUIのソースファイルを入手する方法は公式サイトからのDLやgitなどいっぱいありますが、今回は`npm`コマンドを利用して取得します。

VSCodeを開いて、TODOリストのプロジェクトを開いてからターミナルを開いてください。(`Ctrl + Shift + Y`)

開けましたらそこで以下のコマンドを実行します。

```
> npm install onsenui --save
```

`--save`オプションを付加することで、プロジェクト内の`package.json`ファイルの中に**「このプロジェクトにはonsenuiというモジュールが必須である」**という情報が追加されます。gitなどでプロジェクトを管理しながら、`node_modules`ディレクトリを除外している、、、なんていう場合に便利と思いますが、特に今回は深く気にする必要はないです。

コマンドの実行が完了すると、`node_modules/`フォルダ内にonsenuiとonsenuiが依存しているモジュール達がたくさんインストールされます。今回必要なのは`onsenui`フォルダだけなのでとりあえず無視です！


#### ファイルの移動
`node_modules/`フォルダ内にある状態だと、アプリ側のソースからアクセスすることができないので、読み取ることのできる場所までコピーします。
ちなみにアプリで使用するソースは基本的にはすべて`www/`フォルダ内に配置する必要があります。

その前にまずは`www/`フォルダ内のファイルの配置について説明します。どのように配置しても、ソース内でのパスの指定が間違っていなければ動くのですが、見やすくするために**同じ系統のファイルをフォルダにまとめます。**
今回のアプリでは以下のような階層構造とします。

```
www/
  ├ css/            (CSSファイルを保存する場所)
  │   └ index.css
  ├ img/            (画像ファイルを保存する場所)
  ├ js/             (javascriptファイルを保存する場所)
  │   └ index.js
  ├ lib/            (ライブラリ・共通部品を保存する場所)
  │   ├ js/         (自作の共通部品を保存する場所)
  │   └ onsenui/    (ここにonsenuiをコピー)
  └ index.html
```

ちょっと見づらいかもしれないですが、こんな感じの構造にします。`css/`と`js/`はもとからあると思いますので、`img/`と`lib/`フォルダ、および`lib/js/`フォルダを作成してください。

そして、`node_modules/onsenui/`のフォルダを`www/lib/`内にコピーしてください。これで`index.html`からOnsenUIのCSSやJSを読み込むことができるようになります。


#### index.htmlで読み込む
あと少しで導入は完了です。`index.html`でonsenuiのCSSなどを読み込むようにします。「CSSって何？」という方は以下のリンク先を参照してみてください。

[http://www.htmq.com/csskihon/001.shtml:embed]

[https://saruwakakun.com/html-css/basic/css:embed]

まずは`index.html`内の不要なコメントをすべて削除します。`<!-- -->`で囲ってある部分がコメント部分です。

すると、以下のような感じになると思います。

```html
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <link rel="stylesheet" type="text/css" href="css/index.css">
        <title>Hello World</title>
    </head>
    <body>
        <div class="app">
            <h1>Apache Cordova</h1>
            <div id="deviceready" class="blink">
                <p class="event listening">Connecting to Device</p>
                <p class="event received">Device is Ready</p>
            </div>
        </div>
        <script type="text/javascript" src="cordova.js"></script>
        <script type="text/javascript" src="js/index.js"></script>
    </body>
</html>
```

```html
<link rel="stylesheet" type="text/css" href="css/index.css">
```

の部分ですでにcssを読み込んでいる記述がありますね！
それにならって、以下のようにonsenuiのCSSも読み込んでみましょう。

```html
<head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">

    <!-- CSS読み込み -->
    <link rel="stylesheet" type="text/css" href="lib/onsenui/css/onsenui.css">
    <link rel="stylesheet" type="text/css" href="lib/onsenui/css/onsen-css-components.css">
    <link rel="stylesheet" type="text/css" href="css/index.css">

    <title>TODO List</title>
</head>
...
```

`index.css`の上に、2行分onsenui用のcssを読み込む処理を追加しました。ついでに`<title>`の表示内容もTODO Listに変更しました！(browser実行時しか見ることはありませんが)

`index.html`はプロジェクト作成時の設定のままであれば、`アプリの起動時に一番最初に表示されるHTML`なので、ここで1回読み込むだけで後に読み込むHTMLなどに適応させることができます。

もうひとつ、OnsenUI用のjavascriptも読み込んであげる必要があります。`<body>`の中に

```html
<script type="text/javascript" src="cordova.js"></script>
<script type="text/javascript" src="js/index.js"></script>
```

というCordova用のjavascriptと`index.html`用のjavascriptを読み込んでいる部分があります。先ほどの`<head>`内ではcssを読み込みましたが、こっちではjavascriptを読み込んでいます。

以下のように一行追加してください。

```html
<script type="text/javascript" src="cordova.js"></script>
<script type="text/javascript" src="lib/onsenui/js/onsenui.js"></script>
<script type="text/javascript" src="js/index.js"></script>
```

**普通のWEBページではbodyの末尾でjavascriptを読み込むことでページの表示速度の向上**が期待できますが、今回はそこまでシビアでもないですし、**ライブラリやjsの読み込み部分を集約して見やすくする**ために`<head>`内に移動します。

...ですので、せっかく追記してもらったのですが、最終的に`index.html`ファイル内のソースは以下のような感じになります(*'ω'*)

```html
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        
        <!-- CSS読み込み -->
        <link rel="stylesheet" type="text/css" href="lib/onsenui/css/onsenui.css">
        <link rel="stylesheet" type="text/css" href="lib/onsenui/css/onsen-css-components.css">
        <link rel="stylesheet" type="text/css" href="css/index.css">
        
        <!-- ライブラリ読み込み -->
        <script type="text/javascript" src="cordova.js"></script>
        <script type="text/javascript" src="lib/onsenui/js/onsenui.js"></script>

        <!-- 各処理読み込み -->
        <script type="text/javascript" src="js/index.js"></script>
        
        <title>TODO List</title>
    </head>
    <body>
        <div class="app">
            <h1>Apache Cordova</h1>
            <div id="deviceready" class="blink">
                <p class="event listening">Connecting to Device</p>
                <p class="event received">Device is Ready</p>
            </div>
        </div>
    </body>
</html>
```

これで各ソースの読み込みが完了しました。

### ちょっと作ってみる
簡単なボタンとポップアップの画面を作ってみましょう。

OnsenUIで追加される要素は基本的には`ons-`で始まるものです。以下のページから要素を調べることができます。各名称をクリックすると詳細なマニュアルとサンプルコードを見ることができます。

[https://ja.onsen.io/v2/api/js/:embed]

今回は`<ons-button>`を使用してボタンを作成します。

先ほどの`index.html`の`<body>`内を一旦空にして以下のように修正してください。

```html
<body>
    <ons-navigator id="navi" page="button.html"></ons-navigator>
</body>
```

`<ons-navigator>`に関しては後々の記事で説明しますが、ページの戻る/進むを管理するためのまさにナビゲーター的な要素です。

修正したら、`index.html`と同じフォルダ内(`www/`内)に`button.html`という空のhtmlファイルを作成してください。

`button.html`の中身は以下のようにしてください。

```html
<ons-page id="button.html">
    <ons-button id="button">touch!</ons-button>
</ons-page>
```

`<ons-page>`はhtmlの`<body>`のようなもので、基本的にはこのようにして`<ons-page id="...">`を一ページの単位として画面を追加していきます。

idに指定する値は`<ons-navigator>`の`page`属性に設定したものと一致させてください。

<br><br><br>

最後にjavascriptの処理を追加します。

もともとある`index.js`にとりあえず追加しましょう。**今回はボタンを押した際にポップアップを表示させる**処理を追加したいので元の処理内容をすべて消して、以下のようにしてください。

```javascript
document.addEventListener('init', function(event) {
    // 表示対象のページを取得
    var page = event.target;

    // button.htmlページの処理
    if (page.id === 'button.html') {
        // button.html内の<ons-button id="button">の要素を取得
        var elem_btn = document.getElementById('button');
        
        // ボタンタッチ時の処理を追加
        elem_btn.addEventListener('click', function() {
            // ポップアップの表示
            ons.notification.alert('ボタンを押しました！');
        });
    }
});
```

処理内容はコメントの通りです。繰り返しになりますが詳しくは後々の記事で！(*'ω'*)

OnsenUI特有の処理は`ons.notification.alert()`ですね！これを実行するとポップアップが表示されます。現在はALERTというタイトルでポップアップをひょうじしていますが、その文言も変えたり、[OK]/[CANCEL]ボタン付きのポップアップに変えたりすることもできます。

こんな感じで表示されていれば、今回の内容はばっちりです！

<!-- button画面 -->
<!-- popup -->

CSSを設定していないので不格好ですね( ;∀;)

とりあえず今回はここまでです！お疲れさまでした ^^) _旦~~

### OnsenUI Playground
今回は仮想端末上で動作確認しましたが、ちゃちゃっとHTML/CSSレベルでのソースを確認したい場合は、以下のページで**ブラウザ上で**確認することができます。

[https://onsen.io/playground/:embed]


### 最後に
今回はライブラリ類の読み込みと簡単な処理の作成を行いました。`addEventListener`などのちょっと難しい部分も出てきていましたが、よくわからなくても数十回と書いているうちに指が覚えてくれるものです(*'ω'*)(笑)

次回からはいよいよアプリの画面を作っていきましょう！


### 次の記事
画面の作成
