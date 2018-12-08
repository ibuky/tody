var js_list = {
    /**
     * ページ表示時の処理
     */
    init : function(page) {
        // 登録ボタンに処理を追加
        var elem_reg_btn = document.getElementById('register-button');
        elem_reg_btn.addEventListener('click', this.onClickRegisterButton.bind(this), false);
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
                elem_input.value = '';
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
    }
}

// var js_list = {
//     /**
//      * ページ表示時の処理
//      */
//     init : function(page) {
        
//         // ボタンに登録画面への遷移を設定
//         // var elem_btn = document.getElementById('register-button');      // ボタンの要素を取得
//         // elem_btn.addEventListener('click', this.onClickRegisterButton); // 処理を指定
        
//         var list_data = [];
        
//         this.getRegisteredTodoList()
//             .then(function(data) {
//                 // <ons-list id="list">を取得
//                 var elem_list = document.getElementById('list');
                
//                 /**
//                  * 動的に一覧の作成
//                  */
//                 for (var i = 0; i < data.length; i++) {
//                     // 空の<ons-list-item>を作成
//                     var elem_list_item = document.createElement('ons-list-item');
                    
//                     // 属性を追加
//                     // elem_list_item.setAttribute('modifier', 'chevron');
//                     elem_list_item.setAttribute('tappable', '');
                    
//                     // 表示する値を追加
//                     elem_list_item.innerHTML = data[i].title;
//                     // アイテムごとの値をセット
//                     elem_list_item.line_data = data[i];
                    
//                     // フラグに応じて背景色を変更
//                     // this.changeBgColor(elem_list_item);
                    
//                     // タップ時の動作を設定(詳細画面へ遷移)
//                     elem_list_item.addEventListener('click', this.onClickListItem, false);
                    
//                     // ホールド時の動作を設定(削除確認ポップアップの表示)
//                     // var gd = ons.GestureDetector(elem_list_item);
//                     // gd.on('hold', this.onHoldListItem);
                    
//                     // 親要素に追加
//                     elem_list.appendChild(elem_list_item);
//                 }
//             }.bind(this))
//             .catch(function() {
//                 // SQL処理時にエラーが発生した場合
//             })
//     },
    
//     /**
//      * 登録ボタン押下時の処理
//      */
//     onClickRegisterButton : function(event) {
//         // 登録画面へ遷移
//         // document.getElementById('navi').pushPage('register.html');
//     },
    
//     /**
//      * 登録されている有効なTODOの一覧を取得します。
//      * @returns {Array} 登録された値の配列
//      */
//     getRegisteredTodoList : function() {

//         return new Promise(function(resolve, reject) {
//             var ret = [];   // return用の値保持用
            
//             // 登録情報取得SQL
//             var select_sql = 
//                   "SELECT id, title, detail, important, urgent, date "
//                 + "FROM todo "
//                 + "WHERE valid = ? " 
//                 + "ORDER BY id DESC";
    
//             // SQL(SELECT)を実行
//             db.transaction(function(tx) {
//                 tx.executeSql(select_sql, [js_const.FLAG_Y], function(tx, result) {
//                     console.log(result);
                    
//                     for (var i = 0; i < result.rows.length; i++) {
//                         var obj = {}                    // 一行ごとの値保持用
//                         var vals = result.rows.item(i); // SQlの実行結果
//                         ret.push(vals);
//                     }
//                     resolve(ret);
//                 }, function(error) {
//                     reject();
//                 })
//             })
//         });
//     },

//     /**
//      * 一覧のアイテムをタップしたときの動作
//      * タップしたアイテムの詳細画面へ遷移します。
//      */
//     onClickListItem : function(event) {
//         document.getElementById('navi').pushPage('update.html', {data : event.target.line_data});
//     },

//     /**
//      * フラグに応じて背景色を変更します。
//      * 重要フラグがYの場合、背景をオレンジ色にします。
//      * 緊急フラグがYの場合、背景を赤色にします。
//      * @param {element} elem ons-list-item
//      */
//     changeBgColor : function(elem) {
//         if (elem.urgent === js_const.FLAG_Y) {
//             // 緊急フラグがYの場合
//             elem.classList.add('urgent');
//         } else if (elem.important === js_const.FLAG_Y) {
//             // 緊急フラグがNで、重要フラグがYの場合
//             elem.classList.add('important');
//         }
//     },

//     /**
//      * 一覧のアイテムを長押しした時の動作
//      * 長押ししたアイテムの削除(完了)確認ポップアップを表示します。
//      * OKを押すと削除処理を実行します。
//      */
//     onHoldListItem : function(event) {

//         var opt = {
//             title : '',
//             message : '完了しますか？',
//         };

//         ons.notification.confirm(opt)
//             .then(function(touch) {
//                 if (touch === POPUP_CONFIRM_OK) {
//                     // OKタップ時
                    
//                     // 削除処理を実行
//                     this.deleteListItem(event.target.line_data.id)
//                         .then(function() {
//                             // 処理成功時
//                             ons.notification.alert({
//                                 title : '',
//                                 message : '',
//                             })
//                         })
//                         .catch(function() {
//                             // 処理失敗時
//                             ons.notification.alert({
//                                 title : '',
//                                 message : '更新に失敗しました...',
//                             })
//                         })
//                 }
//             })
//     },

//     /**
//      * 対象のTODOを削除(完了)します。
//      * @param {string} id 削除対象のID
//      * @returns {Promise} 処理に成功した場合true
//      */
//     deleteListItem : function(id) {
//         return new Promise(function(resolve, reject) {
//             db.transaction(function(tx) {
//                 var update_sql = 'UPDATE todo SET valid = ? WHERE id = ?';
//                 tx.executeSql(update_sql, [js_const.FLAG_N, id]);
//             },
//             function(error) {
//                 // UPDATE失敗時
//                 reject();
//             },
//             function() {
//                 // UPDATE成功時
//                 resolve();
//             });
//         });
//     }
// }