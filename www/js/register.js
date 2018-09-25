var js_register = {
    
    /**
     * ページ表示時の処理
     */
    init : function(page) {
        // 登録ボタン
        var button = document.getElementById('submit');
        button.addEventListener('click', this.onClickSubmitButton.bind(this), false);
    },

    /**
     * 登録ボタン押下時の処理
     */
    onClickSubmitButton : function() {
        if (!this.checkInputData().bind(this)) {    // 入力情報のチェックとともに、結果を評価
            // エラー発生時、後続処理を一切実行しない
            return;
        }

        var input_data = this.getInputData();                // 入力情報の取得
        var sql_insert = this.createInsertSql(input_data);   // INSERT文の作成

        if (this.execInsertSql(sql_insert)) {   // INSERT文の実行とともに、実行結果を評価
            /***** INSERT成功時 *****/
            this.showNoTitlePopup('登録しました！');

            // 画面遷移
            document.getElementById('navi').resetToPage('list.html');

        } else {
            /***** INSERT失敗時 *****/
            this.showNoTitlePopup('登録に失敗しました...');
        }
    },

    /**
     * 入力情報のチェックを行います。
     */
    checkInputData : function() {
        // タイトルのチェック
        var title_input = document.getElementById('title');
        if (title_input === '') {
            // 空の場合、エラー
            this.showNoTitlePopup('タイトルを入力してください。');
            return false;
        }

        if (title_input.length > 50) {
            // 50文字以上の場合、エラー
            this.showNoTitlePopup('タイトルは50字以内で入力してください。');
            return false;
        }

        // 詳細情報のチェック
        var detail_input = document.getElementById('detail');
        if (false) {
            // 6行以上の入力の場合、エラー

        }

        if (false) {
            // XX文字以上の場合、エラー
        }

        // 何もエラーがない場合、trueを返す
        return true;        
    },

    /**
     * タイトルなしのポップアップを表示します。
     * @param {string} message 表示するメッセージ
     */
    showNoTitlePopup : function(message) {
        ons.notification.alert({
            title : '',
            message : message,
        })
    }
}