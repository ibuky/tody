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
  - 処理後に一覧画面をリロードする

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
ボタン押下時の処理を追加します。既に過去に一覧を動的に作成する処理をここに記述していますが、とりあえず一旦全部コメントアウトしておいてください。ソースを全選択した状態で`Ctrl + /`で全コメントアウトできます。


##### 入力値の取得
##### INSERT処理
##### 処理結果のポップアップ
##### 入力項目を空にする
##### 一覧画面のリロード



### 次の記事
