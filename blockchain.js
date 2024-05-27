const SHA256 = require('crypto-js/sha256');

// ブロックを作成
class Block {
    constructor(timestamp, data, previousHash) {
        // 以下でブロック内に必要なタイムスタンプ、取引データ、1つ前のハッシュ、計算したハッシュ値を作成
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    // ハッシュ値を計算するためのメソッド
    // dataは配列データのためJSONを使用
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}