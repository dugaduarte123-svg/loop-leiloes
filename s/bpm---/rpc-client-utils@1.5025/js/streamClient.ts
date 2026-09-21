import { parseServerSentEvents } from './serverSentEvents';
/**
 * Processes a ServerSentEvent and unwraps the data.
 * @param event The ServerSentEvent to process
 * @param onProgress Callback for successful data processing
 * @param onError Callback for error handling
 */
function processEventAndUnwrap(event, onProgress, onError) {
  if (event.data) {
    try {
      const parsedData = JSON.parse(event.data.trim());
      onProgress(parsedData);
    } catch (error) {
      onError(error);
    }
  }
}

/**
 * Streams a response using the Fetch API and processes SSE events.
 * Uses a generic type parameter to allow the caller to specify the expected data structure.
 *
 * @param response The Response object from fetch
 * @param options Configuration options including callbacks for stream events
 * @returns A Promise that resolves when the stream completes or rejects on error
 */
export async function stream(response, {
  onProgress,
  onError,
  onClose,
  signal
}) {
  try {
    // Handle non-successful responses
    if (!response.ok) {
      const error = new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      onError(error);
      return;
    }

    // Check content type to ensure we're getting SSE
    const contentType = response.headers.get('Content-Type');
    if (contentType && !contentType.includes('text/event-stream')) {
      console.warn(`Expected text/event-stream content type but got ${contentType}. Will attempt to process anyway.`);
    }
    const reader = response.body.getReader();
    // eslint-disable-next-line compat/compat
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let isClosed = false;

    // Set up abort handler if a signal is provided
    if (signal) {
      // If the signal is already aborted, clean up and exit
      if (signal.aborted) {
        await reader.cancel();
        return;
      }

      // Handle future abort signals
      signal.addEventListener('abort', () => {
        if (!isClosed) {
          isClosed = true;
          // Cancel reader but don't wait for it in the event handler
          reader.cancel().catch(() => {
            // Silently ignore cancellation errors
          });
          onClose();
        }
      });
    }

    // Process the stream
    try {
      // eslint-disable-next-line no-constant-condition
      while (!isClosed) {
        // Check if we should abort before each read
        if (signal !== null && signal !== void 0 && signal.aborted) {
          break;
        }
        const {
          done,
          value
        } = await reader.read();
        if (done) {
          if (!isClosed) {
            isClosed = true;
            onClose();
          }
          break;
        }

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, {
          stream: true
        });

        // Parse SSE events from the buffer
        const {
          events,
          consumed
        } = parseServerSentEvents(buffer);
        buffer = buffer.slice(consumed);

        // Process each event
        for (const event of events) {
          // Check for abort signal between processing events
          if (signal !== null && signal !== void 0 && signal.aborted) {
            break;
          }
          processEventAndUnwrap(event, onProgress, onError);
        }
      }
    } finally {
      // Ensure we decode any final chunks with stream=false
      if (buffer.length > 0) {
        const {
          events
        } = parseServerSentEvents(buffer);
        for (const event of events) {
          if (!(signal !== null && signal !== void 0 && signal.aborted)) {
            processEventAndUnwrap(event, onProgress, onError);
          }
        }
      }

      // Close the stream if not already closed
      if (!isClosed) {
        isClosed = true;
        onClose();
      }
    }
  } catch (error) {
    // Don't report errors if the stream was aborted
    if (signal !== null && signal !== void 0 && signal.aborted) {
      return;
    }
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}
export default stream;