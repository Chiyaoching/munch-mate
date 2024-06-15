/*
 * @Author: Seven Yaoching-Chi 
 * @Date: 2024-06-13 00:21:10 
 * @Last Modified by: Seven Yaoching-Chi
 * @Last Modified time: 2024-06-14 17:40:25
 */

const { Pinecone } = require('@pinecone-database/pinecone')

class PineconeEvents {
  constructor(apiKey, dbNamespace, dbIndex) {
    this.apiKey = apiKey;
    this.pc = new Pinecone({apiKey});
    this.dbIndex = dbIndex
    this.dbNamespace = dbNamespace
    this.index = this.pc.index(dbIndex);
  }

  async queryDB ({query, topK}) {
    const res = await this.index.namespace(this.dbNamespace).query({
      topK,
      vector: query,
      includeValues: true,
      includeMetadata: true,
    });
    return res
  }
}

module.exports = PineconeEvents