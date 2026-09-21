export class ActivityService {
    static async getGlobalActivities(limit: number = 20, offset: number = 0) {
        return [
            { id: "act_1", event: "Sale", nft: "Cyber Pulse #101", price: "1.25 ETH", time: new Date().toISOString() },
            { id: "act_2", event: "Mint", nft: "Ethereal Realm #44", price: "0.00 ETH", time: new Date().toISOString() },
        ];
    }

    static async getNFTActivities(nftContract: string, tokenId: string) {
        return [
            { id: "act_1", event: "Minted", price: "0.00 ETH", from: "0x000", to: "0x123", time: new Date().toISOString() },
        ];
    }
}
