export class IPFSService {
    static async uploadMedia(fileBuffer: Buffer, fileName: string): Promise<string> {
        const hash = "bafybeig" + Math.random().toString(36).substring(2, 12);
        return `ipfs://${hash}`;
    }

    static async uploadMetadata(metadata: object): Promise<string> {
        const hash = "bafybeimeta" + Math.random().toString(36).substring(2, 12);
        return `ipfs://${hash}`;
    }
}
