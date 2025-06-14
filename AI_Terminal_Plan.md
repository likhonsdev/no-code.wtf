# AI Terminal Integration Plan

## Overview
This plan outlines the integration of Xterm.js to provide a terminal interface within the application, leveraging the AI SDK to generate commands and interact with terminal output.

## Phases

### Phase 1: Project Setup and Xterm.js Integration
1.  **Verify Project Structure:** Examine the existing project structure to determine the best place for the new terminal component.
2.  **Install Xterm.js:** Add `@xterm/xterm` and potentially `@xterm/addon-fit` (for responsive sizing) to the project dependencies.
3.  **Create a React Component for Xterm.js:** Develop a new React component that encapsulates the Xterm.js terminal. This component will handle:
    *   Initializing the `Terminal` object.
    *   Attaching the terminal to a DOM element.
    *   Handling terminal resizing (using `addon-fit`).
    *   Exposing methods to write to the terminal.
    *   Capturing user input from the terminal.

### Phase 2: AI SDK Integration for Command Generation/Interaction
1.  **Identify AI SDK Core Usage:** Determine how the AI SDK Core is currently used or how it *should* be used to generate text (commands) or process output. This might involve:
    *   Setting up a language model (e.g., Gemini-2.0-flash).
    *   Defining a prompt engineering strategy for command generation.
    *   Potentially using "Tool Calling" if the AI needs to execute specific predefined actions based on terminal output or user requests.
2.  **Create an AI Service/Hook:** Develop a service or a React hook that interacts with the AI SDK Core to:
    *   Send user input from the Xterm.js terminal to the AI model.
    *   Receive generated commands or responses from the AI model.
    *   Potentially process terminal output before sending it to the AI.

### Phase 3: Connecting Xterm.js and AI SDK
1.  **Input Flow:** When a user types into the Xterm.js terminal and presses Enter, capture that input. Send this input to the AI service/hook.
2.  **Output Flow:** When the AI service/hook returns a generated command or response, write this output back to the Xterm.js terminal.
3.  **Command Execution (Server-side via WebSocket - Recommended):**
    *   The Xterm.js component will connect to a backend server (e.g., using `@xterm/addon-attach`) via a WebSocket.
    *   This server will:
        *   Receive input from the client's Xterm.js.
        *   Execute the AI-generated command on the server (e.g., using `node-pty` or similar).
        *   Stream the terminal output back to the client's Xterm.js.
    *   This will likely involve modifying `artifacts/gemini/server.ts` or creating a new server file.

### Phase 4: Refinement and Error Handling
1.  **Error Handling:** Implement robust error handling for both Xterm.js (e.g., connection issues) and AI SDK (e.g., API errors, rate limits). The `AIErrorBoundary` component from AI SDK UI could be useful here.
2.  **UI Integration:** Integrate the new Xterm.js component into an existing page or create a new page for it.
3.  **Styling:** Ensure the terminal is styled appropriately.

## Detailed Plan Steps:

### Goal 1: Set up Xterm.js in a React component.
*   **Step 1.1: Install Dependencies.**
    *   `npm install @xterm/xterm @xterm/addon-fit`
*   **Step 1.2: Create `components/AITerminal.tsx`.** This file will house the Xterm.js component.
    *   It will import `Terminal` and `FitAddon`.
    *   It will use `useEffect` to initialize and clean up the terminal.
    *   It will expose a way to send input to the AI and display output from the AI.

### Goal 2: Integrate AI SDK for command generation.
*   **Step 2.1: Review existing AI SDK Core setup.** Check `artifacts/gemini/server.ts` and `lib/artifacts/server/index.ts` to understand how AI models are currently accessed or if a new endpoint is needed.
*   **Step 2.2: Define AI prompt for command generation.** This will be crucial for guiding the AI to produce valid terminal commands.
*   **Step 2.3: Create an AI interaction hook/function.** This will abstract the AI SDK calls. For example, a function `generateCommand(input: string): Promise<string>` that calls the AI model.

### Goal 3: Connect Xterm.js input/output with AI SDK.
*   **Step 3.1: Capture Xterm.js input.** Modify `AITerminal.tsx` to listen for user input (e.g., `term.onData`).
*   **Step 3.2: Send input to AI and display output.** When input is captured, send it to the AI interaction hook. Once a command is generated, write it back to the terminal.
*   **Step 3.3: Implement command execution (Server-side via WebSocket).** Set up a WebSocket server that uses `node-pty` to run actual shell commands. Connect `AITerminal.tsx` to this server using `@xterm/addon-attach`. The AI-generated commands would then be sent to this server for execution. This would likely involve modifying `artifacts/gemini/server.ts` or creating a new server file.

### Goal 4: Refine and integrate.
*   **Step 4.1: Implement basic error handling.**
*   **Step 4.2: Integrate `AITerminal.tsx` into a main application component.**

## Flow Diagram

```mermaid
graph TD
    A[User Input in Browser] --> B(Xterm.js Component);
    B -- onData event --> C{AI Interaction Logic};
    C -- User Input --> D[AI SDK Core (Model)];
    D -- Generated Command --> C;
    C -- Command to execute --> E[WebSocket Server];
    E -- Execute Command (node-pty) --> F[Shell Process];
    F -- Terminal Output --> E;
    E -- Stream Output --> B;
    B -- Display Output --> A;