import { Kafka } from "kafkajs";
import { es } from "./elastic.js";

const kafka = new Kafka({ brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "upload-group" });

await consumer.connect();
await consumer.subscribe({
  topic: "file-events",
  fromBeginning: false,
});

await consumer.run({
  eachMessage: async ({ message }) => {
    const data = JSON.parse(message.value.toString());
    console.log("Kafka event received:", data);

    const status =
      data.status === "UPLOAD_STARTED"
        ? "UPLOADING"
        : data.status === "PROCESSING_DONE"
        ? "DONE"
        : data.status;

    await es.index({
      index: "uploads",
      document: {
        fileId: data.fileId,
        fileName: data.fileName || "unknown",
        status,
        time: data.time || new Date().toISOString(),
      },
    });
  },
});
