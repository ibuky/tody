# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(2 - Cordovaプロジェクトの作成)

### 前の記事
[http://www.taneyats.com/entry/cordova-app-1:embed]


### 目標
- コマンドプロンプト上で任意のフォルダの場所に移動できるようになる(`cd`, `dir`を覚える)
- 基本的な`Cordova`コマンドを使えるようになる。
- `config.xml`ファイルなどを今回のアプリ用に修正する。


### プロジェクトの作成
まずは作成するアプリの全ファイルを保存する場所を作成します。コマンドプロンプト上でプロジェクトを作成したいフォルダまで移動して、以下のコマンドを実行します。

コマンドプロンプトでのフォルダ移動やファイルの一覧の表示方法などがわからないよいう場合は以下のページを参考にしてみてください。

[https://eng-entrance.com/cmd-usage:embed]

`cd`と`dir`さえ使えれば任意の場所まで移動できると思います！
(Windowsでは「ディレクトリ」という単語は使わず「フォルダ」と表現するはずなのですが、なぜコマンドは`cd`(Change Directory)なのでしょうか？(笑)不思議ですね('ω'))

気を取り直して以下のコマンドを実行です！

```
> cordova create [プロジェクト名]
```

プロジェクトを作成する場所やプロジェクト名は何でも構いませんが、迷うという方は作成場所はホームディレクトリ(`C:\Users\[自分のユーザー名]`)に、`todo-list`という名前で作成しましょう(*'ω'*)

`Creating a new cordova project`と表示されていれば実行できています。表示されない場合やエラーっぽい文言が表示されている場合は、**前の記事でのCordovaのインストールがうまくいっていない場合があります。**`-g`オプションをつけて`npm install`を行ったかどうかを確認してください。


### VSCodeでプロジェクトを開く
作成したプロジェクフォルダをVSCodeで開きます。ツールバーの`[ファイル] > [フォルダーを開く]`から今作成したフォルダを選択します。

選択後に、VSCodeの左側の部分に以下のような感じでファイルとフォルダ群が表示されていると思います。

<!-- エクスプローラーの画像 -->
<div class="center">
    <a data-flickr-embed="true"  href="https://www.flickr.com/photos/153853557@N08/44314524434/in/dateposted-public/" title="open_on_vscode"><img src="https://farm2.staticflickr.com/1930/44314524434_18d56eec8c_z.jpg" width="240" height="577" alt="open_on_vscode"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
</div>

拡張設定を入れていないままだとファイルとフォルダのアイコンがそっけない感じになっていると思います。拡張機能の`Material Icon Theme`というものを導入すると画像のような感じで拡張子ごとにアイコンを変更してくれます。


### プロジェクトの設定ファイルを修正
次にプロジェクトやアプリの設定を管理するファイルを修正します。

`config.xml`という名前のファイルがあると思いますので、そのファイルを開いて修正します。

```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="io.cordova.hellocordova" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>HelloCordova</name>
    <description>
        A sample Apache Cordova application that responds to the deviceready event.
    </description>
    <author email="dev@cordova.apache.org" href="http://cordova.io">
        Apache Cordova Team
    </author>

...
```

|修正する部分|修正内容|例|備考|
|-----------|-------|-----|----|
|widget id="io.cordova.hellocordova"|好きな値.アプリ名|com.taneyats.todo-list|[ドメイン名を逆から表記].[アプリ名]がAndroid標準なのでそれに従う。
|\<name\>HelloCordova\</name\>|アプリ名|Todo-list|ここに設定した文字列が、ホーム画面などに表示される名前になります|

とりあえずこの二つは変更しておきましょう。widget idを後から変更してしまうと、**新しいバージョンのこのアプリをスマホにインストールした時に更新とならず、古いバージョンのものも残ってしまいます。**なので、ほかのアプリと被らないような完全にユニークなIDを設定してあげる必要があります。

併せて`<description>`(アプリの概要)、`<author>`(製作者の名前やメールアドレス・WEBサイトなど)の部分も変更しておいたほうがいいです。何せ自分で作るアプリなのですから、、、(笑)

アプリには直接まったく関係ないですが`package.json`というファイルを修正しておいていいかもしれないです。プロジェクトを作成した時点だと`config.xml`ファイルと同じようにcorodovaのデフォルトの値が設定されているため、オリジナル感がなくなってしまいますね、、( ;∀;)

```json
{
    "name": "todo-list",
    "displayName": "todo-list",
    "version": "1.0.0",
    "description": "A simple TODO list app for Android and (maybe!) for iPhone.",
    "main": "index.js",
    "author": "taneyats",
    "license": "Apache-2.0",
...
```

`name`と`displayName`の部分にアプリ名を設定しておくといいでしょう。`description`と`author`の部分も修正したい方はしましょう。

このファイルはほかの人が同じようにこのプロジェクトの開発環境を構築するときに必要となる場合がありますが、詳しい説明は特にしないです。( 一一)


### プラットフォームを追加する
最後に開発対象の端末のプラットフォームを追加します。プラットフォームを追加することで、その端末やOS(AndroidやiOSなど)にインストールするためのファイルを`build`というコマンドで作成することができるようになります。

以下のコマンドはAndroidの最新バージョン用のプラットフォームを追加するコマンドです。コマンドプロンプトでプロジェクト内で実行するか、
VSCodeのターミナル機能(Ctrl + Shift + Y)を利用して実行してください。VSCodeのターミナルは起動時にプロジェクト内にいる状態から始まるので便利です！

```
> cordova platforms add android
```

androidの部分をiosと変更するとiOSのプラットフォームが追加されてiOS用のインストールファイルができるのようになるはずですが、未確認です( ;∀;)

追加済みのプラットフォームの一覧を表示するには`cordova platforms ls`を実行します。`Installed platforms:`の下に表示されているものがインストール済みのものです。削除するには`cordova platforms remove android`を実行します。

以上で今回は終了です！お疲れさまでした ^^) _旦~~


### 最後に
今回はCordovaプロジェクトの作成からプラットフォームの追加まで行いました。ここまでくればあとはコードを書いてデバッグあるのみです！
次の記事では**実際にサンプルアプリを仮想端末上で動かしてみます。**

コマンドプロンプトやターミナルなどの(CLI: Command Line Interface)を触ったことのない方も少しずつ慣れてきたでしょうか？
少し慣れてきてコマンドも覚えてくると、よくある映画でハッカーやITオタクが操作しているようなことができるようになる。。。かも？


### 次の記事
仮想端末 or ブラウザからサンプルアプリを実行する