# HTML/CSS/JavascriptでAndroid/iOSアプリをつくる。(9 - 登録画面の作成(JavaScript))

### 前の記事
画面の作成(HTML)

### JavaScript処理の追加
#### 起動時にテーブルを作成
まずはデータを登録するためのテーブルを作成します。

以前ローカルDBについていろいろやりましたが基本は同じです。テーブル項目は入力項目に合うように変更しましょう。

```sql
CREATE TABLE IF NOT EXISTS todo (
    id          INTEGER PRIMARY KEY,    -- ID(主キー)
    valid       TEXT    NOT NULL,       -- 有効フラグ
    title       TEXT    NOT NULL,       -- タイトル
    detail      TEXT,                   -- 詳細情報
    important   TEXT    NOT NULL,       -- 重要フラグ
    urgent      TEXT    NOT NULL,       -- 緊急フラグ
    date        TEXT    NOT NULL        -- 登録日時
);
```

### 次の記事
一覧から詳細画面へと遷移する