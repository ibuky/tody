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
        if (!this.checkInputData()) {    // 入力情報のチェックとともに、結果を評価
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
        var title = document.getElementById('title');
        if (title.value === '') {
            // 空の場合、エラー
            this.showNoTitlePopup('タイトルを入力してください。');
            return false;
        }

        if (title.length > 50) {
            // 50文字以上の場合、エラー
            this.showNoTitlePopup('タイトルは50字以内で入力してください。');
            return false;
        }

        // 詳細情報のチェック
        var detail = document.getElementById('detail');
        var detail_val = detail.value;
        
        if (detail_val !== '') {
            // 詳細情報に入力がある場合

            var detail_line_count = detail.value.match(/\n/g).length + 1;   // 行数を取得

            // 行数チェック
            if (detail_line_count > 5) {
                // 6行以上の入力の場合、エラー
                this.showNoTitlePopup('内容は5行以内で入力してください。');
                return false;
            }
        }
        
        // 何もエラーがない場合、trueを返す
        return true;
    },

    getInputData : function() {
        var input_vals = [];    // 入力値保持用
        
        input_vals.title     = document.getElementById('title').value;        // タイトル
        input_vals.detail    = document.getElementById('detail').value;       // 詳細情報
        input_vals.important = document.getElementById('important');    // 重要フラグ
        input_vals.urgent    = document.getElementById('urgent');       // 緊急フラグ
        

        return input_vals;
    },

    /**
     * スイッチのON/OFF状態を判定し、y/nの値を返します。
     * @param {boolean} val switch要素のchecked
     * @returns {string} スイッチがONの場合、'y'
     */
    getYnValueForSwitch : function(val) {
        if (val) {
            return 'y'; // スイッチがONの場合
        } else {
            return 'n'; // スイッチがOFFの場合
        }
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