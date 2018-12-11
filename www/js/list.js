var js_list = {
    /**
     * ページ表示時の処理
     */
    init : function(page) {
        // 登録ボタンに処理を追加
        var elem_reg_btn = document.getElementById('register-button');
        elem_reg_btn.addEventListener('click', this.onClickRegisterButton.bind(this), false);

        // 登録されているデータの取得
        this.getRegisteredData()
            .then(function(ret) {
                this.dispTodoList(ret);
            }.bind(this))
            .catch(function() {
                // 失敗時
                this.dispNoTitlePopup('一覧の作成に失敗しました。')
            }.bind(this))
    },

    /**
     * 登録ボタン押下時の処理
     */
    onClickRegisterButton : function() {
        var values = {};    // 入力値格納用

        // 入力値の取得
        var elem_input = document.getElementById('input-title');
        values.title = elem_input.value;

        // エラーが発生している場合、以降の処理を行わない
        if (!this.checkError(values)) return;

        // INSERT処理を実行
        this.execInsertSql(values)
            .then(function() {
                // 成功時
                this.dispNoTitlePopup('登録しました!');
                elem_input.value = '';  // 入力項目を空にする

                this.getRegisteredData()
                    .then(function(ret) {
                        this.dispTodoList(ret);
                    }.bind(this))
            }.bind(this))
            .catch(function() {
                // 失敗時
                this.dispNoTitlePopup('登録に失敗しました...');
            }.bind(this));
    },

    /**
     * エラーチェックを行います。
     * @param {Object} values 入力値
     * @returns {boolean} エラーがあればfalse
     */
    checkError : function(values) {
        if (values == {}) {
            this.dispNoTitlePopup('入力値を正しく取得できません。');
            return false;
        }

        // 入力値のチェック
        if (values.title == null || values.title == '') {
            // 値が取得できない OR 空の場合エラー
            this.dispNoTitlePopup('タイトルを入力してください。');
            return false;
        }

        return true;
    },

    /**
     * INSERT文を実行します。
     * @param {Object} values 入力値
     */
    execInsertSql : function(values) {
        // INSERT文の実行
        return new Promise(function(resolve, reject) {
            db.transaction(function(tx) {
                // INSERT文
                var insert_sql =
                      'INSERT INTO todo (valid, title, date)'
                    + 'VALUES (1,?,CURRENT_TIMESTAMP)';

                var insert_val = [values.title];

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
                resolve();
            });
        });
    },

    /**
     * タイトルなしのポップアップを表示します。
     * @param {String} message メッセージ部分に表示する内容 
     */
    dispNoTitlePopup : function(message) {
        ons.notification.alert({
            title: '',
            message: message
        });
    },

    /**
     * データベースに登録されているデータを取得します。
     * @returns {Array} 登録されているデータ
     */
    getRegisteredData : function() {
        return new Promise(function(resolve, reject) {
            var ret = [];   // return用の値保持用
            
            // 登録情報取得SQL
            var select_sql = 
                  "SELECT id, title, date "
                + "FROM todo "
                + "WHERE valid = 1 "
                + "ORDER BY id DESC";
    
            // SQL(SELECT)を実行
            db.transaction(function(tx) {
                tx.executeSql(select_sql, [], function(tx, result) {
                    for (var i = 0; i < result.rows.length; i++) {
                        var vals = result.rows.item(i); // 一行分のデータ
                        ret.push(vals);                 // 配列に格納してまとめる
                    }
                    console.log(ret);                   // デバッグ分から確認用
                    resolve(ret);
                }, function(error) {
                    reject();
                })
            })
        });
    },

    /**
     * 取得した値で一覧を作成します
     * @param {Array} data 取得した値
     */
    dispTodoList : function(data) {
        var elem_list = document.getElementById('list');    // <ons-list id="list">を取得
        
        elem_list.textContent = null;   // 子要素を全て削除
        
        for (var i = 0; i < data.length; i++) {
            // 空の<ons-list-item>を作成
            var elem_list_item = document.createElement('ons-list-item');
        
            // 属性を追加
            elem_list_item.setAttribute('modifier', 'chevron');
            elem_list_item.setAttribute('tappable', '');
        
            // 表示する値を追加
            elem_list_item.innerHTML = data[i].title;
            // アイテムごとの値をセット
            elem_list_item.line_data = data[i];
        
            // タップ時の動作を設定(詳細画面へ遷移)
            elem_list_item.addEventListener('click', this.onClickListItem.bind(this), false);
        
            // 親要素に追加
            elem_list.appendChild(elem_list_item);
        }
    },

    /**
     * アイテムタップ時の処理。
     */
    onClickListItem : function(event) {
        ons.notification.confirm({
            title: '',
            message: 'このTODOを完了しますか?',
            callback: (answer) => this.onCloseConfirmPop(answer, event),
        })
    },

    /**
     * 確認用ポップアップを閉じる時の処理。
     * @param {Number} answer [CANCEL]を選択した場合0
     */
    onCloseConfirmPop : function(answer, event) {
        if (answer <= 0) return;    // [CANCEL]押下時は何もしない
        
        var line_data   = event.target.line_data || event.target.parentElement.line_data;
        var id          = line_data.id;
        if (id == null) return;

        this.execUpdateSql(id)
            .then(() => {
                this.dispNoTitlePopup('完了しました!');
                this.getRegisteredData().then((ret) => this.dispTodoList(ret));
            })
            .catch(() => {
                this.dispNoTitlePopup('完了処理に失敗しました...');
            })
    },

    /**
     * UPDATE文を実行します。
     * @param {Number} id 更新対象のデータのid
     */
    execUpdateSql : function(id) {
        var update_sql = 'UPDATE todo SET valid = 0 WHERE id = ?';
        var vals = [id];

        return new Promise(function(resolve, reject) {
            db.transaction(function(tx) {
                // 実行部分
                tx.executeSql(update_sql, vals);
            }, function(error) {
                // SQL処理エラー発生時の処理
                console.log('更新処理失敗 : ' + error.message);
                reject();
            }, function() {
                // SQL処理成功時の処理
                console.log('更新処理成功');
                resolve();
            })
        })
    }
}