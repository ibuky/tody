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
現状一覧に何もない状態だとまっさらで何も表示されないので何か表示させてみます。


##### その他
チェックボックスを追加して一度に複数削除するとか、上のタイトルの部分に残っているTODOの個数を表示させるとか追加できそうな機能はいくらでもあるのですが、今回は省略します。とりあえずは基本的な部分だけでもアプリとして完成させてしまいましょう!

### 次の記事
アプリのビルド
[https://www.taneyats.com/entry/cordova-app-12:embed]
