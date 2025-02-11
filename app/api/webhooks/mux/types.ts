// Define a type for the metadata object
interface MuxMetadata {
  userId?: string;
  [key: string]: unknown; // Allow other dynamic fields
}

// Define a type for Mux event data
interface MuxWebhookData {
  id: string;
  status: string;
  upload_id?: string;
  playback_ids?: { id: string }[];
  duration?: number;
  aspect_ratio?: string;
  passthrough?: string;
  new_asset_settings?: { passthrough?: string };
}

// Define the handler function type
type WebhookHandler = (args: {
  data: MuxWebhookData;
  metadata: MuxMetadata;
}) => Promise<void>;

// Define a mapping of webhook event types to their handler functions
const WEBHOOK_TYPES: Record<string, WebhookHandler> = {
  "video.asset.preparing": async ({ data, metadata }) => {
    console.log("Handling video.asset.preparing event...", data, metadata);
    // Add custom logic if needed
  },

  "video.asset.ready": async ({ data, metadata }) => {
    console.log("Handling video.asset.ready event...", data, metadata);
    // You could trigger post-processing or notifications here
  },

  "video.asset.errored": async ({ data, metadata }) => {
    console.error("Handling video.asset.errored event...", data, metadata);
    // Handle errors, notify admin, etc.
  },

  "video.upload.cancelled": async ({ data, metadata }) => {
    console.log("Handling video.upload.cancelled event...", data, metadata);
    // Clean up any database records if needed
  },

  "video.upload.failed": async ({ data, metadata }) => {
    console.error("Handling video.upload.failed event...", data, metadata);
    // Log errors, send notifications, etc.
  },
};

export default WEBHOOK_TYPES;
export type { MuxWebhookData, MuxMetadata, WebhookHandler };
