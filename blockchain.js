const SHA256 = require('crypto-js/sha256');

// Fintech、サプライチェーン、仮想通貨以外(できれば)
// プロトタイプ作成と同時に考える
// 使用するプラットフォームについても考える、 Ethereumなどを使うことを考えておく

// ブロックを作成
class Block {
    constructor(timestamp, data, previousHash) {
        // 以下でブロック内に必要なタイムスタンプ、取引データ、1つ前のハッシュ、計算したハッシュ値を作成
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // NONCE(一度だけ使われる番号)、ブロックにNONCEの値を入れてこの値を変化させることでブロックの頭に0がくるハッシュ値を探す
    }
    // ハッシュ値を計算するためのメソッド
    // dataは配列データのためJSONを使用
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    mineBlock() {
        // ここではハッシュ値の頭に0が2つ来ることがマイニングの条件であるため以下のように記述
        while(this.hash.substring(0, 2) !== '00') {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("ブロックがマイニングされました : " + this.hash);
    }
}

// Blockchainクラスを作成
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    // ジェネシスブロック(一番最初のブロック)を作成するメソッド
    createGenesisBlock(){
        return new Block ("01/01/2019", "GenesisBlock", "0");
    }
    // 1つ前のブロックのハッシュ値を取得するメソッド
    getLatestBlock() {
        // chainは配列データのため-1をして値を取得
        return this.chain[this.chain.length - 1];
    }
    // ブロックを追加していくメソッド
    addBlock(newBlock) {
        newBlock.mineBlock();
        // chain配列にpush
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {  // 最初のブロックはジェネシスブロックであり検証の必要がないため次のブロックから検証を開始
            const currentBlock = this.chain[i]; // 現在のブロック
            const previousBlock = this.chain[i - 1]; // 1つ前のブロック
            // 現在のブロックのハッシュ値と、ハッシュを再度計算したものを比べ、値が変わっていないか確認
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            // currentBlock.previousHash(現在のブロックに含まれる1つ前のハッシュ)とpreviousBlock.hash(1つ前のブロックのハッシュ)を比較し、値が違わないか確認
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let originalCoin = new Blockchain();

originalCoin.addBlock(new Block("06/02/2019", {SendCoinToA : 3}));
originalCoin.addBlock(new Block("07/03/2019", {SendCoinToB : 8}));

originalCoin.chain[1].data = { SendCoinToA: 200 };

console.log('ブロックの中身を書き換えた状態:' + originalCoin.isChainValid());

//STEP1 ブロックのデータを書き換えた状態で、更にハッシュ値を再計算する
originalCoin.chain[1].hash = originalCoin.chain[1].calculateHash();

//STEP2 上のSTEP2の記述(ブロックの中身の出力)をここに移動させる
console.log(JSON.stringify(originalCoin, null, 2));

//STEP3 再度ブロックチェーンの妥当性をチェックしてみる
console.log('ハッシュ値を再計算した場合:' + originalCoin.isChainValid());


