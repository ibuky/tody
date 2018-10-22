var js_register = {
    /* 定数 */
    FLAG_Y : '1',  // フラグ(true)
    FLAG_N : '0',  // フラグ(false)

    /**
     * ページ表示時の処理
     */
    init : function(page) {
        // 登録ボタン
        var submit_button = document.getElementById('submit');
        submit_button.addEventListener('click', this.onClickSubmitButton.bind(this), false);
    },

    /**
     * 登録ボタン押下時の処理
     */
    onClickSubmitButton : function() {
        if (!this.checkInputData()) {    // 入力情報のチェックとともに、結果を評価
            // エラー発生時、後続処理を一切実行しない
            return;
        }

        var input_data = this.getInputData();   // 入力情報の取得

        // INSERT文の実行(Promise)
        this.execInsertSql(input_data)
            .then(function() {
                // INSERT成功時
                this.showNoTitlePopup('登録しました！');
                document.getElementById('navi').resetToPage('list.html');   // 一覧画面に戻る
            }.bind(this))
            .catch(function() {
                // INSERT失敗時
                this.showNoTitlePopup('登録に失敗しました...');
            }.bind(this));
    },

    /**
     * 入力情報のチェックを行います。
     * @returns {boolean} エラーが発生していない場合、true
     */
    checkInputData : function() {
        // タイトルのチェック
        var title_val = document.getElementById('title').value;
        if (!title_val) {
            // 空の場合、エラー
            this.showNoTitlePopup('タイトルを入力してください。');
            return false;
        }

        if (title_val.length > 50) {
            // 50文字以上の場合、エラー
            this.showNoTitlePopup('タイトルは50字以内で入力してください。');
            return false;
        }

        // 詳細情報のチェック
        var detail_val = document.getElementById('detail').value;
        
        if (detail_val) {
            // 詳細情報に入力がある場合
            if (!detail_val.match(/\n/g)) {
                // 改行コードが存在していない場合(1行)
                return true;
            }
            
            // 改行コードが存在している場合(2行以上)
            var detail_line_count = detail_val.match(/\n/g).length + 1;
            
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

    /**
     * 画面に入力された値を取得します。
     * @returns {Object} 画面に入力された値
     */
    getInputData : function() {
        var input_vals = {};    // 入力値保持用
        
        input_vals.title     = document.getElementById('title').value;  // タイトル
        input_vals.detail    = document.getElementById('detail').value; // 詳細情報
        input_vals.important = this.getYnValueForSwitch(document.getElementById('important').checked);    // 重要フラグ
        input_vals.urgent    = this.getYnValueForSwitch(document.getElementById('urgent').checked);       // 緊急フラグ
        
        return input_vals;
    },

    /**
     * スイッチのON/OFF状態を判定し、y/nの値を返します。
     * @param {boolean} val switch要素のchecked
     * @returns {string} スイッチがONの場合、1(true)
     */
    getYnValueForSwitch : function(val) {
        if (val) {
            return this.FLAG_Y; // スイッチがONの場合
        } else {
            return this.FLAG_N; // スイッチがOFFの場合
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
    },

    /**
     * 入力した情報からINSERT文を発行します。
     * @param {object} input_data 入力情報
     * @returns {Promise}
     */
    execInsertSql : function(input_data) {
        // INSERT文の実行
        return new Promise(function(resolve, reject) {
            db.transaction(function(tx) {
                var insert_sql = 
                      'INSERT INTO todo (valid, title, detail, important, urgent, date) '
                    + 'VALUES (1,?,?,?,?,CURRENT_TIMESTAMP)';   // INSERT文

                var insert_val = [
                    input_data.title,
                    input_data.detail,
                    input_data.important,
                    input_data.urgent
                ]

                tx.executeSql(insert_sql, insert_val);
            },
            function(error) {
                // INSERT失敗時
                console.log('INSERTに失敗しました : ' + error.message);
                reject();
            },
            function() {
                // INSERT成功時
                console.log('INSERTに成功しました');
                console.log(input_data);
                resolve();
            });
        });
    },

    /**
     * 一覧画面から渡された値を各入力項目へセットします。
     * @param {object} data 入力値のオブジェクト
     * @returns {boolean} 全項目のセットに成功した場合true
     */
    setTodoValues : function(data) {
        if (!data) return false;

        if (!this.setValueToInputField('title', data.title)) {
            return false;
        } else if (!this.setValueToInputField('detail', data.title)) {
            return false;
        } else if (!this.setValueToInputField('important', data.title)) {
            return false;
        } else if (!this.setValueToInputField('urgent', data.title)) {
            return false;
        }

        return true;
    },

    /**
     * 値を項目へセットします。
     * @param {string} id    対象の入力フィールドのID
     * @param {string} value セットする値
     * @returns {boolean}    値のセットに成功した場合true
     */    
    setValueToInputField : function(id, value) {
        if (!field || !value) return false; // いづれかの引数が空の場合
        
        var elem = getElementById(id);
        if (!elem) return false;

        elem.value = value;

        return true;
    }
}
