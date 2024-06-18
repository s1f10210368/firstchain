const SHA256 = require('crypto-js/sha256');

// プロトタイプ作成と同時に考える
// 使用するプラットフォームについても考える、 Ethereum, hardhat(おすすめ)などを使うことを考えておく
// NFTを発行することによりよりデータを安全に

// トランザクションクラスの作成
class Transaction {
    constructor(senderAddress, recipientAddress, amount) {
        this.senderAddress = senderAddress;
        this.recipientAddress = recipientAddress;
        this.amount = amount;
    }
}

// ブロックを作成
class Block {
    constructor(timestamp, transactions, previousHash) {
        // 以下でブロック内に必要なタイムスタンプ、取引データ、1つ前のハッシュ、計算したハッシュ値を作成
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // NONCE(一度だけ使われる番号)、ブロックにNONCEの値を入れてこの値を変化させることでブロックの頭に0がくるハッシュ値を探す
    }
    // ハッシュ値を計算するためのメソッド
    // dataは配列データのためJSONを使用
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
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
        // 承認前のトランザクションを格納する配列
        this.pendingTransactions = [];
        this.miningReward = 12.5;
    }
    // ジェネシスブロック(一番最初のブロック)を作成するメソッド
    createGenesisBlock(){
        return new Block ("05/02/2019", [], "0");
    }
    // 1つ前のブロックのハッシュ値を取得するメソッド
    getLatestBlock() {
        // chainは配列データのため-1をして値を取得
        return this.chain[this.chain.length - 1];
    }
    // ブロックを追加していくメソッド
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock();
        console.log('ブロックが正常にマイニングされました');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
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
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address) {
        //STEP2 初期の残高は0
        let balance = 0;
        //STEP3 for文で、chainに含まれるブロックの数をループさせる
        for (const block of this.chain) {
            //STEP4 さらにfor文で、ブロック内のトランザクションのデータの個数文をループさせる
            for (const trans of block.transactions) {
                //STEP5 もしaddressが送金アドレス(this.senderAddress)の場合は、残高から金額分をマイナス
                if (trans.senderAddress === address) {
                    balance -= trans.amount;
                }
                //STEP6 もしaddressが受け取りアドレス(this.recipientAddress)の場合は、残高から金額分をプラス
                if (trans.recipientAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        //STEP7 最後に、残高を返す
        return balance;
    }
}

let originalCoin = new Blockchain();

originalCoin.createTransaction(new Transaction(null, 'your-address', 12.5));

// アドレス1から自分のアドレスに10コインを送金
originalCoin.createTransaction(new Transaction('address1', 'your-address', 10));

// 自分のアドレスからアドレス2に2コインを送金
originalCoin.createTransaction(new Transaction('your-address', 'address2', 2));

console.log('\n マイニングを開始');
originalCoin.minePendingTransactions('your-address');

console.log('\n あなたのアドレス残高は', originalCoin.getBalanceOfAddress('your-address'));

// 再度マイニング
console.log('\n マイニングを再度実行');
originalCoin.minePendingTransactions('your-address');

// 残高計算の記述
console.log('\n あなたのアドレスの残高は', originalCoin.getBalanceOfAddress('your-address'));
