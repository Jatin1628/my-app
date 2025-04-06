declare module "elevenlabs-node" {
    const voice: {
      textToSpeech: (
        apiKey: string,
        voiceID: string,
        filePath: string,
        text: string
      ) => Promise<void>;
    };
    export default voice;
  }