export class SearchService {
    static async searchAll(query: string) {
        return {
            nfts: [{ id: "1", title: `NFT matching ${query}` }],
            collections: [{ id: "col_1", name: `Collection matching ${query}` }],
            users: [{ wallet: "0x123", username: query }],
        };
    }
}
