# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(# - ローカルDBの作成、有効化)

### 前の記事
### 目標
- DB(データベース)を触る。
- CRUD(Create/Refer/Update/Delete)ができるようになる。
  - `INSERT`, `SELECT`, `UPDATE`, `DELETE`文を作成できるようになる。

といいましたが、SQLの文法については詳しく触れるつもりはないです。ちらりとProgateをのぞいてみましたが、最近はSQLなんかもあるんですね！これは心強い(*'ω'*)

### プラグインのインストール
#### cordova-sqlite-storage
`cordova-sqlite-storage`を使ってスマホ内にDBを作成します。プロジェクト内のターミナルで以下のコマンドを実行してプラグインをインストールします。

```
> cordova plugin add cordova-sqlite-storage
...
Saved plugin info for "cordova-sqlite-storage" to config.xml
```

完了するとソースが追加され、`config.xml`に一行追加されます。

```xml
<plugin name="cordova-sqlite-storage" spec="^2.4.0" />
```







### 次の記事


### 参考
公式ドキュメント

[https://github.com/litehelpers/Cordova-sqlite-storage:embed]

Cordova アプリ内に SQLite でローカル DB を構築できる cordova-sqlite-storage

[http://neos21.hatenablog.com/entry/2017/06/23/080000:embed]

