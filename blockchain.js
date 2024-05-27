class Block {
    constructor(timestamp, data, previousHash) {
        this.timestamp = timestamp;
        this.data = data;
        //STEP1: previousHashのコンストラクタを追記
        this.previousHash = previousHash;
    }
}