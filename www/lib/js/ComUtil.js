var ComUtil = {
    /**
     * sleepを実行します。
     * @param {int} ms sleepする時間(ミリ秒)
     */
    sleep : function(ms) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve();
            }, ms);
        });
    },
}