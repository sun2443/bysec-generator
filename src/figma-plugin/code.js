// Figma Plugin Main Code
// This code runs in the main Figma thread

// Show the plugin UI
figma.showUI(__html__, {
  width: 1400,
  height: 900,
  themeColors: true,
});

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-pattern') {
    try {
      // Get the image data from the UI
      const imageData = msg.imageData;
      
      // Create a new rectangle in Figma
      const rect = figma.createRectangle();
      
      // Set the size based on aspect ratio
      const aspectRatio = msg.aspectRatio || "16:9";
      let width = 1600;
      let height = 900;
      
      if (aspectRatio === "1:1") {
        width = 1200;
        height = 1200;
      } else if (aspectRatio === "3:4") {
        width = 900;
        height = 1200;
      } else if (aspectRatio === "9:16") {
        width = 675;
        height = 1200;
      }
      
      rect.resize(width, height);
      
      // Convert base64 to Uint8Array
      const base64Data = imageData.split(',')[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create image in Figma
      const image = figma.createImage(bytes);
      
      // Apply image as fill
      rect.fills = [{
        type: 'IMAGE',
        imageHash: image.hash,
        scaleMode: 'FILL'
      }];
      
      // Position the rectangle in the center of the viewport
      rect.x = figma.viewport.center.x - width / 2;
      rect.y = figma.viewport.center.y - height / 2;
      
      // Select the newly created rectangle
      figma.currentPage.selection = [rect];
      figma.viewport.scrollAndZoomIntoView([rect]);
      
      // Notify the UI
      figma.ui.postMessage({
        type: 'pattern-created',
        success: true
      });
      
    } catch (error) {
      console.error('Error creating pattern:', error);
      figma.ui.postMessage({
        type: 'pattern-created',
        success: false,
        error: error.message
      });
    }
  }
  
  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
  
  if (msg.type === 'notify') {
    figma.notify(msg.message);
  }
};
