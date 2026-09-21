import { PARENT_ID } from '../constants/elementSelectors';
import { SCREEN_CAPTURE_BLOB } from '../iframe-communication/constants/sentPostMessageTypes';
import { WHITE, NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';

// Keep in sync with MAX_FILE_SIZE in conversations-visitor-ui/static/js/attachments/components/FileUpload.tsx
const MAX_FILE_SIZE = 10485760;
export class ScreenCapturePlugin {
  constructor(widgetShell) {
    this.setWidgetVisibility = visible => {
      const parent = document.getElementById(PARENT_ID);
      if (parent) {
        parent.style.setProperty('opacity', visible ? '1' : '0');
      }
    };
    this.wrapText = (ctx, text, maxWidth) => {
      const lines = [];
      let line = '';
      for (const char of text) {
        const next = line + char;
        if (ctx.measureText(next).width > maxWidth && line.length > 0) {
          lines.push(line);
          line = char;
        } else {
          line = next;
        }
      }
      if (line) lines.push(line);
      return lines;
    };
    this.addUrlToImage = (canvas, url) => {
      const ctx = canvas.getContext('2d');
      const fontSize = Math.max(12, canvas.height * 0.018);
      const font = `500 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace`;
      ctx.font = font;
      const padding = 16;
      const lines = this.wrapText(ctx, url, canvas.width - padding * 2);
      const lineHeight = fontSize + 6;
      const urlContentHeight = lines.length * lineHeight + padding;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const imageHeight = canvas.height;
      canvas.height = imageHeight + urlContentHeight;
      ctx.putImageData(imageData, 0, 0);
      ctx.font = font;
      ctx.fillStyle = NEUTRAL_1600;
      ctx.fillRect(0, imageHeight, canvas.width, urlContentHeight);
      ctx.fillStyle = WHITE;
      ctx.textBaseline = 'top';
      const textY = imageHeight + (urlContentHeight - lines.length * lineHeight) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, padding, textY + i * lineHeight);
      });
    };
    this.estimateDataUrlBytes = dataUrl => {
      const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
      return Math.ceil(base64.length * 3 / 4);
    };
    this.captureScreenshot = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          // @ts-ignore This is a non-spec property that forces the browser to capture the current tab
          // but it's only supported in Chrome for now so it's not typed.
          preferCurrentTab: true,
          video: {
            displaySurface: 'browser'
          }
        });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();
        const MAX_PIXELS = 2880 * 1800;
        const capturedPixels = video.videoWidth * video.videoHeight;
        let videoWidth;
        let videoHeight;
        if (capturedPixels > MAX_PIXELS) {
          const scale = Math.sqrt(MAX_PIXELS / capturedPixels);
          videoWidth = Math.round(video.videoWidth * scale);
          videoHeight = Math.round(video.videoHeight * scale);
        } else {
          videoWidth = video.videoWidth;
          videoHeight = video.videoHeight;
        }
        const canvas = document.createElement('canvas');
        const drawToCanvas = (w, h) => {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            this.addUrlToImage(canvas, window.location.href);
          }
        };
        drawToCanvas(videoWidth, videoHeight);
        stream.getTracks().forEach(track => track.stop());
        let dataUrl = canvas.toDataURL('image/png');
        if (this.estimateDataUrlBytes(dataUrl) > MAX_FILE_SIZE) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
        if (this.estimateDataUrlBytes(dataUrl) > MAX_FILE_SIZE) {
          const sizeRatio = MAX_FILE_SIZE / this.estimateDataUrlBytes(dataUrl);
          const dimensionScale = Math.sqrt(sizeRatio);
          drawToCanvas(Math.round(videoWidth * dimensionScale), Math.round(videoHeight * dimensionScale));
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
        const estimatedBytes = this.estimateDataUrlBytes(dataUrl);
        if (estimatedBytes > MAX_FILE_SIZE) {
          const message = `Screenshot exceeds maximum file size and could not be compressed (${videoWidth}x${videoHeight}px, ~${Math.round(estimatedBytes / 1024)}KB)`;
          this.widgetShell.devLogger.error(message);
          this.widgetShell.logError(message);
        }
        return dataUrl;
      } catch (e) {
        this.widgetShell.devLogger.error(e instanceof Error ? e.message : 'Unknown error');
      }
    };
    this.handleScreenCaptureRequest = async () => {
      this.setWidgetVisibility(false);
      const dataUrl = await this.captureScreenshot();
      if (dataUrl) {
        const ext = dataUrl.startsWith('data:image/jpeg') ? 'jpg' : 'png';
        const fileName = `${document.title}-${Date.now()}.${ext}`;
        this.widgetShell.iframeMessage.post(SCREEN_CAPTURE_BLOB, {
          dataUrl,
          fileName
        });
      }
      this.setWidgetVisibility(true);
    };
    this.widgetShell = widgetShell;
  }

  /**
   * Captures a screenshot of the current tab using the browser's mediaDevices API
   * @returns {Promise<string>} A promise that resolves to the dataUrl of the screenshot
   */
}