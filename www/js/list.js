var js_list = {
    
    /**
     * ページ表示時の処理
     */
    init : function(page) {
        
        // ボタンに登録画面への遷移を設定
        var elem_btn = document.getElementById('register-button');      // ボタンの要素を取得
        elem_btn.addEventListener('click', this.onClickRegisterButton); // 処理を指定


        // 表示する文字列を指定(配列数だけ一覧が作成される)
        var disp_str = [
            '1行目です',
            '2行目です',
            '3行目です',
            '4行目です',
            '5行目です',
        ]
        
        // <ons-list id="list">を取得
        var elem_list = document.getElementById('list');

        /**
         * disp_strの数に応じて動的に一覧の作成
         */
        for (var i = 0; i < disp_str.length; i++) {
            // 空の<ons-list-item>を作成
            var elem_list_item = document.createElement('ons-list-item');

            // 属性を追加
            elem_list_item.setAttribute('modifier', 'chevron');
            elem_list_item.setAttribute('tappable', '');

            // 表示する値を追加
            elem_list_item.innerHTML = disp_str[i];

            /**
             * ここまでの段階では
             * elem_list_itemという変数に <ons-list-item modifier="chevron" tappable>n行目です</ons-list-item>
             * が作成されただけで、画面には表示されていない。
             * 表示させるためには、<ons-list id="list">の子要素に追加する必要がある。
             */

            // 親要素に追加
            elem_list.appendChild(elem_list_item);
        }


        /**
         * disp_strの数に応じて動的に一覧の作成(foreach)
         */
        disp_str.forEach(function(str) {
            // 空の<ons-list-item>を作成
            var elem_list_item = document.createElement('ons-list-item');
            
            // 属性を追加
            elem_list_item.setAttribute('modifier', 'chevron');
            elem_list_item.setAttribute('tappable', '');
            
            // 表示する値を追加
            elem_list_item.innerText = str + ' (forEachで追加)';
            
            // 親要素に追加
            elem_list.appendChild(elem_list_item);
        });
    },

    /**
     * 登録ボタン押下時の処理
     */
    onClickRegisterButton : function(event) {
        // 登録画面へ遷移
        document.querySelector('#navi').pushPage('register.html');
    },
}