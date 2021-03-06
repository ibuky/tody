# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(12(終) - アプリのビルド)
こんにちは、たねやつです。**いよいよ最後の記事となりました！**

やることはそこまで多くはないですし、設定値を変えてコマンドを数個実行するだけなので拍子抜けに簡単です(笑)


### 前の記事
[https://www.taneyats.com/entry/cordova-app-11:embed]


### 今までのソース
ここのリポジトリにすべてあげてありますので処理がうまく進まない場合などの参考にしてください。基本的な動作は確認済みですが詳細なテストは行っていません。。。

[https://github.com/ibuky/tody:embed]


### バージョンなどを確認
`config.xml`にアプリのメタ情報的なものを記述しています。初回のほうでも触れていますがここでアプリの表示名やバージョンを制御できます。一番見た目にかかわるものは`<name>`タグの中身です。ここの文字列がそのまま**スマホのホーム画面に表示されます。**


### ビルドコマンドを実行
`cordova build android`をコマンドラインで実行するとapkファイルを作成することができます。

```
> cordova build android
...

BUILD SUCCESSFUL in 3s
46 actionable tasks: 3 executed, 43 up-to-date
Built the following apk(s):
        [project]\platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

`Built the following apk(s):`の下にビルドされたapkファイルのパスが表示されます。`Win + R`で表示されるファイル名を指定して実行に張り付けるとエクスプローラーでそのフォルダを簡単に表示することができます。

このファイルを何らかの方法でスマホに渡して、インストールすると実際に使えるようになります。メールやgoogle Drive経由などで渡す方法があります。

実機を開発しているPCに接続して送り込む方法もありますが、**スマホごとにドライバが必要になったりする場合があったりと結構面倒なので**今回は割愛します。

<br>
***
<br>

コマンドを実行してapkファイルを作成していますが、実はこのapkファイルはデバッグ時(`Run Android on emulator`実行時)に毎回作成されて同じ場所に置かれています。ですので最終確認から特に変更がなければ特にコマンドを実行する必要はありません。


### スマホの設定
Googleプレイストア以外から入手したアプリをインストールする場合には設定を変更する必要があります。以下のリンク先にバージョンごとに設定する方法が記載されています。

[https://www.teradas.net/archives/6078/:embed]

Android 9の場合、Google Drive経由でインストールしようとすると「Google Driveから提供元不明のアプリをインストールするには設定を変更してください。」という旨の内容が表示され、そこから設定を変更 → インストールすることができました。

実機でも少し動かし見ましょう。今回はこれ以上ないぐらい単純な動作しかしないのですが、もっと複雑なものになってくると仮想端末上での操作感と異なってくる(=使いにくい)場合があります。実機でのテストも必ず行うようにしてください。

仮想端末上で動くけど、実機では動かない・エラーが発生する場合は

- 仮想端末のバージョンを実機と合わせる
- 実機をPCに挿してデバッグモードで実行する

などして対応する必要があります。またChromeから実際に動いているアプリのデバッグ分の確認やソースの表示などを行うこともできるようです。

[https://developers.google.com/web/tools/chrome-devtools/remote-debugging/?hl=ja:embed]


### 最後に
全12回の連載でしたがいかがでしたでしょうか?
私自身もそんなにJavaScriptが詳しいわけではない状態で、修正するべき箇所は山積みですがとりあえず動いているのでヨシ!ですね(笑)

基本的な技能と開発の流れが確認出来たらあとは自分のアイデア次第でいろんなものが作れるようになるのであとは皆さま次第です。。。('Д')

現在CordovaとOnsenUIと同じような構成で別のもうちょっと有意義なアプリを作成しています。こちらも大体完成したら報告しようかなあと思います！


### 次の記事
特に予定なし。
