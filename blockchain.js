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
    }
    // ハッシュ値を計算するためのメソッド
    // dataは配列データのためJSONを使用
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
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
        // 1つ前のハッシュ値を取得し代入
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlockのハッシュ値を代入
        newBlock.hash = newBlock.calculateHash();
        // chain配列にpush
        this.chain.push(newBlock);
    }
    isChainValid() {
        //STEP2 for文でループを回す記述を行う
        for (let i = 1; i < this.chain.length; i++) {
            //STEP3 currentBlockとpreviousBlockにそれぞれ値を代入
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            //STEP4 現在のハッシュ値と、ハッシュを再度計算たものを比べ、値が変わっていないか確認
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            //STEP5 currentBlock.previousHashとpreviousBlock.hashを比較し、値が違わないか確認
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        //STEP6 trueを返す
        return true;
    }
}

let originalCoin = new Blockchain();

originalCoin.addBlock(new Block("06/02/2019", {SendCoinToA : 3}));
originalCoin.addBlock(new Block("07/03/2019", {SendCoinToB : 8}));

console.log(JSON.stringify(originalCoin, null, 2));

// 改竄前の状態
console.log('改ざんなしの状態:' + originalCoin.isChainValid());
