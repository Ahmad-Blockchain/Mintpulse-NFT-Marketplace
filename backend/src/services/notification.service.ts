export class NotificationService {
    static async getUserNotifications(walletAddress: string) {
        return [
            { id: "notif_1", title: "NFT Sold", message: "Your item Cyber Pulse #101 was sold for 1.25 ETH", read: false }
        ];
    }

    static async markAllAsRead(walletAddress: string) {
        return { success: true };
    }
}
