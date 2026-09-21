export class FavoriteService {
    static async toggleFavorite(walletAddress: string, nftContract: string, tokenId: string) {
        return { isFavorite: true, count: 12 };
    }

    static async getUserFavorites(walletAddress: string) {
        return [
            { id: "1", title: "Cyber Pulse #101", price: "1.25 ETH" }
        ];
    }
}
