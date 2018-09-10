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
    <ons-fab position="bottom right">
        <ons-icon icon="md-plus"></ons-icon>
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
    font-weight: bold;          /* 太字に */
}
```

背景色などは好きな値を指定してOKです。上記ソースで指定している色はデフォルトの`ons-button`の色と同じです。(変数化されていないのでライブラリ内から探しました)

<!-- ons-fab-color.png -->



### 登録画面の作成
#### 画面レイアウト
#### 処理


### 目標
### 次の記事
登録した値を一覧画面に表示
