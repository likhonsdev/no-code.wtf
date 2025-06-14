# no-code.wtf
Prompt engineering is the process where you guide generative artificial intelligence (generative AI) solutions to generate desired outputs. Even though generative AI attempts to mimic humans, it requires detailed instructions to create high-quality and relevant output. 
One of the standout features is the enhanced code blocks that allow for additional meta-information to be included. This is done by specifying details after the triple backticks, such as:

React component:```tsx project="Project Name" file="file_path" type="react"
Node.js code:```js project="Project Name" file="file_path" type="nodejs"
HTML page:```html project="Project Name" file="file_path" type="html"
Markdown document:```md project="Project Name" file="file_path" type="markdown"
Flowchart (Mermaid chart):```mermaid title="Example Flowchart" type="diagram"
Other code (non-executable or non-previewable):```python project="Project Name" file="file_name" type="code"
Chain of Thought (CoT) Integration
The system employs a Chain of Thought (CoT) approach for handling complex programming tasks. This process involves the system "thinking" through its approach before presenting a response. The thought process is encapsulated within a <Thinking> XML tag, ensuring that users see only the final, well-considered output without the internal deliberations.
Large language models (LLMs) today, such as GPT-3.5 Turbo, GPT-4, and Claude 3, are tuned to follow instructions and are trained on large amounts of data. Large-scale training makes these models capable of performing some tasks in a "zero-shot" manner. Zero-shot prompting means that the prompt used to interact with the model won't contain examples or demonstrations. The zero-shot prompt directly instructs the model to perform a task without any additional examples to steer it.

We tried a few zero-shot examples in the previous section. Here is one of the examples (ie., text classification) we used:

Prompt:

Classify the text into neutral, negative or positive. 
Text: I think the vacation is okay.
Sentiment:

Output:

Neutral

Note that in the prompt above we didn't provide the model with any examples of text alongside their classifications, the LLM already understands "sentiment" -- that's the zero-shot capabilities at work.

Instruction tuning has been shown to improve zero-shot learning Wei et al. (2022). Instruction tuning is essentially the concept of finetuning models on datasets described via instructions. Furthermore, RLHF (reinforcement learning from human feedback) has been adopted to scale instruction tuning wherein the model is aligned to better fit human preferences. This recent development powers models like ChatGPT. We will discuss all these approaches and methods in upcoming sections.

When zero-shot doesn't work, it's recommended to provide demonstrations or examples in the prompt which leads to few-shot prompting. In the next section, we demonstrate few-shot prompting.  Combining CoT prompting and tools in an interleaved manner has shown to be a strong and robust approach to address many tasks with LLMs. These approaches typically require hand-crafting task-specific demonstrations and carefully scripted interleaving of model generations with tool use. Paranjape et al., (2023) propose a new framework that uses a frozen LLM to automatically generate intermediate reasoning steps as a program.

ART works as follows:

given a new task, it select demonstrations of multi-step reasoning and tool use from a task library
at test time, it pauses generation whenever external tools are called, and integrate their output before resuming generation
ART encourages the model to generalize from demonstrations to decompose a new task and use tools in appropriate places, in a zero-shot fashion. In addition, ART is extensible as it also enables humans to fix mistakes in the reasoning steps or add new tools by simply updating the task and tool libraries. The process is demonstrated below:

ART
Image Source: Paranjape et al., (2023)

ART substantially improves over few-shot prompting and automatic CoT on unseen tasks in the BigBench and MMLU benchmarks, and exceeds performance of hand-crafted CoT prompts when human feedback is incorporated.

Below is a table demonstrating ART's performance on BigBench and MMLU tasks:

ART2
Image Source: Paranjape et al., (2023)
Zero-shot Prompting
Few-shot Prompting
Chain-of-Thought Prompting
Meta Prompting
Self-Consistency
Generate Knowledge Prompting
Prompt Chaining
Tree of Thoughts
Retrieval Augmented Generation Automatic Prompt Engineer
Active-Prompt
Directional Stimulus Prompting
Program-Aided Language Models
ReAct
Reflexion
Multimodal CoT
Graph Prompting
Agents
Introduction to Agents
Agent Components
Guides
Optimizing Prompts
OpenAI Deep Research
Reasoning LLMs
Applications
Fine-tuning GPT-4o
Function Calling
Context Caching with LLMs
Generating Data
Generating Synthetic Dataset for RAG
Tackling Generated Datasets Diversity
Generating Code
Graduate Job Classification Case Study
Prompt Function
Prompt Hub
Classification
Coding
Creativity
Evaluation
Information Extraction
Image Generation
Mathematics
Question Answering
Reasoning
Text Summarization
Truthfulness
Adversarial Prompting LLM Agents
LLM based agents, hereinafter also referred to as LLM agents for short, involve LLM applications that can execute complex tasks through the use of an architecture that combines LLMs with key modules like planning and memory. When building LLM agents, an LLM serves as the main controller or "brain" that controls a flow of operations needed to complete a task or user request. The LLM agent may require key modules such as planning, memory, and tool usage.

To better motivate the usefulness of an LLM agent, let's say that we were interested in building a system that can help answer the following question:

What's the average daily calorie intake for 2023 in the United States?

The question above could potentially be answered using an LLM that already has the knowledge needed to answer the question directly. If the LLM doesn't have the relevant knowledge to answer the question, it's possible to use a simple RAG system where an LLM has access to health related information or reports. Now let's give the system a more complex question like the following:

How has the trend in the average daily calorie intake among adults changed over the last decade in the United States, and what impact might this have on obesity rates? Additionally, can you provide a graphical representation of the trend in obesity rates over this period?

To answer such a question, just using an LLM alone wouldn't be enough. You can combine the LLM with an external knowledge base to form a RAG system but this is still probably not enough to answer the complex query above. This is because the complex question above requires an LLM to break the task into subparts which can be addressed using tools and a flow of operations that leads to a desired final response. A possible solution is to build an LLM agent that has access to a search API, health-related publications, and public/private health database to provide relevant information related to calorie intake and obesity.

In addition, the LLM will need access to a "code interpreter" tool that helps take relevant data to produce useful charts that help understand trends in obesity. These are the possible high-level components of the hypothetical LLM agent but there are still important considerations such as creating a plan to address the task and potential access to a memory module that helps the agent keep track of the state of the flow of operations, observations, and overall progress.

Learn more about LLM-based agents and advanced prompting methods in our new AI courses. Join now!

Use code PROMPTING20 to get an extra 20% off.

LLM Agent Framework
"LLM Agent Framework"

Generally speaking, an LLM agent framework can consist of the following core components:

User Request - a user question or request
Agent/Brain - the agent core acting as coordinator
Planning - assists the agent in planning future actions
Memory - manages the agent's past behaviors
Agent
A large language model (LLM) with general-purpose capabilities serves as the main brain, agent module, or coordinator of the system. This component will be activated using a prompt template that entails important details about how the agent will operate, and the tools it will have access to (along with tool details).

While not mandatory, an agent can be profiled or be assigned a persona to define its role. This profiling information is typically written in the prompt which can include specific details like role details, personality, social information, and other demographic information. According to [Wang et al. 2023], the strategies to define an agent profile include handcrafting, LLM-generated or data-driven.

Planning
Planning Without Feedback
The planning module helps to break down the necessary steps or subtasks the agent will solve individually to answer the user request. This step is important to enable the agent to reason better about the problem and reliably find a solution. The planning module will leverage an LLM to decompose a detailed plan which will include subtasks to help address the user question. Popular techniques for task decomposition include Chain of Thought and Tree of Thoughts which can be categorized as single-path reasoning and multi-path reasoning, respectively. Below is a figure comparing different strategies as formalized in Wang et al., 2023:

"LLM Agent Planning"

Planning With Feedback
The planning modules above don't involve any feedback which makes it challenging to achieve long-horizon planning to solve complex tasks. To address this challenge, you can leverage a mechanism that enables the model to iteratively reflect and refine the execution plan based on past actions and observations. The goal is to correct and improve on past mistakes which helps to improve the quality of final results. This is particularly important in complex real-world environments and tasks where trial and error are key to completing tasks. Two popular methods for this reflection or critic mechanism include ReAct and Reflexion.

As an example, ReAct combines reasoning and acting aimed at enabling an LLM to solve complex tasks by interleaving between a series of steps (repeated N times): Thought, Action, and Observation. ReAct receives feedback from the environment in the form of observations. Other types of feedback can include human and model feedback. The figure below shows an example of ReAct and the different steps involved in performing question answering:

"ReAct Agent"

Learn more about ReAct here:

ReAct Prompting
Memory
The memory module helps to store the agent's internal logs including past thoughts, actions, and observations from the environment, including all interactions between agent and user. There are two main memory types that have been reported in the LLM agent literature:

Short-term memory - includes context information about the agent's current situations; this is typically realized by in-context learning which means it is short and finite due to context window constraints.
Long-term memory - includes the agent's past behaviors and thoughts that need to be retained and recalled over an extended period of time; this often leverages an external vector store accessible through fast and scalable retrieval to provide relevant information for the agent as needed.
Hybrid memory integrates both short-term memory and long-term memory to improve an agent's ability for long-range reasoning and accumulation of experiences.

There are also different memory formats to consider when building agents. Representative memory formats include natural language, embeddings, databases, and structured lists, among others. These can also be combined such as in Ghost in the Minecraft (GITM) that utilizes a key-value structure where the keys are represented by natural language and values are represented by embedding vectors.

Both the planning and memory modules allow the agent to operate in a dynamic environment and enable it to effectively recall past behaviors and plan future actions.

Tools
Tools correspond to a set of tool/s that enables the LLM agent to interact with external environments such as Wikipedia Search API, Code Interpreter, and Math Engine. Tools could also include databases, knowledge bases, and external models. When the agent interacts with external tools it executes tasks via workflows that assist the agent to obtain observations or necessary information to complete subtasks and satisfy the user request. In our initial health-related query, a code interpreter is an example of a tool that executes code and generates the necessary chart information requested by the user.

Tools are leveraged in different ways by LLMs:

MRKL is a framework that combines LLMs with expert modules that are either LLMs or symbolic (calculator or weather API).
Toolformer fine-tune LLMs to use external tool APIs.
Function Calling - augments LLMs with tool use capability which involves defining a set of tool APIs and providing it to the model as part of a request.
HuggingGPT - an LLM-powered agent that leverages LLMs as a task planner to connect various existing AI models (based on descriptions) to solve AI tasks.
"HuggingGPT"

LLM Agent Applications
"ChemCrow"The ChemCrow agent designed to complete tasks across organic synthesis, drug discovery, and materials design. Figure source: Bran et al., 2023

In this section, we highlight examples of domains and case studies where LLM-based agents have been effectively applied due to their complex reasoning and common sense understanding capabilities.

Notable LLM-based Agents
Ma et al. (2023) analyze the effectiveness of conversational agents for mental well-being support and find that the agent can help users cope with anxieties but it can sometimes produce harmful content.
Horton (2023) gives LLM-based agents endowment, preferences, and personalities to explore human economic behaviors in simulated scenarios.
Generative Agents and AgentSims both aim to simulate human daily life in a virtual town by constructing multiple agents.
Blind Judgement employs several language models to simulate the decision-making processes of multiple judges; predicts the decisions of the real-world Supreme Court with better-than-random accuracy.
Ziems et al. (2023) presents agents that can assist researchers in tasks such as generating abstracts, scripting, and extracting keywords.
ChemCrow is an LLM chemistry agent that utilizes chemistry-related databases to autonomously plan and execute the syntheses of insect repellent, three organocatalysts, and guided discovery of a novel chromophore.
[Boiko et al. (2023)] combines multiple LLMs for automating the design, planning, and execution of scientific experiments.
Math Agents assist researchers in exploring, discovering, solving and proving mathematical problems. EduChat and CodeHelp are two other notable examples of LLM agents designed for education.
Mehta et al. (2023) propose an interactive framework that enables human architects to interact with AI agents to construct structures in a 3D simulation environment.
ChatDev, ToolLLM, MetaGPT are notable examples where AI agents show potential to automate coding, debugging, testing, and assist with other software engineering tasks.
D-Bot a LLM-based database administrator that continuously acquires database maintenance experience and provides diagnosis and optimization advice for databases.
IELLM applies LLMs to address challenges in the oil and gas industry.
Dasgupta et al. 2023 presents a unified agent system for embodied reasoning and task planning.
OS-Copilot a framework to build generalist agents capable of interfacing with comprehensive elements in an operating system (OS), including the web, code terminals, files, multimedia, and various third-party applications.
LLM Agent Tools
"AutoGen"AutoGen capabilities; Figure Source: https://microsoft.github.io/autogen

Below are notable examples of tools and frameworks that are used to build LLM agents:

LangChain: a framework for developing applications and agents powered by language models.
AutoGPT: provides tools to build AI agents.
Langroid: Simplifies building LLM applications with Multi-Agent Programming: agents as first-class citizens, collaborating on tasks via messages.
AutoGen: a framework that enables the development of LLM applications using multiple agents that can converse with each other to solve tasks.
OpenAgents: an open platform for using and hosting language agents in the wild.
LlamaIndex - a framework for connecting custom data sources to large language models.
GPT Engineer: automate code generation to complete development tasks.
DemoGPT: autonomous AI agent to create interactive Streamlit apps.
GPT Researcher: an autonomous agent designed for comprehensive online research on a variety of tasks.
AgentVerse: designed to facilitate the deployment of multiple LLM-based agents in various applications.
Agents: an open-source library/framework for building autonomous language agents. The library supports features including long-short term memory, tool usage, web navigation, multi-agent communication, and brand new features including human-agent interaction and symbolic control.
BMTools: extends language models using tools and serves as a platform for the community to build and share tools.
crewAI: AI agent framework reimagined for engineers, offering powerful capabilities with simplicity to build agents and automations.
Phidata: a toolkit for building AI Assistants using function calling.
LLM Agent Evaluation
""AgentBench benchmark to evaluate LLM-as-Agent on real-world challenges and 8 different environments. Figure source: Liu et al. 2023
Sheikh Chat - AI-Powered Code Assistant
An advanced AI code assistant powered by Google Gemini Pro, featuring real-time code editing capabilities with CodeMirror/Monaco Editor integration and Sandpack for live code previews.

🚀 Features
Real-time AI chat powered by Google Gemini Pro
Live collaborative code editing with CodeMirror/Monaco Editor
Instant, interactive code previews using Sandpack (no page reloads)
Server-side streaming with Vercel AI SDK for fast, responsive AI
Modern UI with Tailwind CSS and shadcn/ui components
Fully responsive, accessible design
TypeScript-first codebase
Real-time code validation and syntax highlighting
Extensible architecture for custom AI workflows
🏆 Why Sheikh Chat is Better than v0.dev
Live Editing & Preview: Instantly edit and preview code in real time—no waiting for builds or reloads.
Modern, Customizable UI: Built with Tailwind CSS and shadcn/ui for a beautiful, accessible experience.
Open & Extensible: Easily add new AI models, workflows, or UI components.
Streaming AI Responses: Get code suggestions as you type, powered by Google Gemini Pro and Vercel AI SDK.
Full Sandpack Integration: Preview React, TypeScript, and more with full support for Sandpack environments.
Transparent & Open Source: MIT licensed, with clear, well-documented code.
🛠️ Tech Stack
Frontend: Next.js 14, React 18
AI: Google Gemini Pro, Vercel AI SDK
Code Editing: CodeMirror 6, Monaco Editor
Code Preview: Sandpack
Styling: Tailwind CSS, shadcn/ui
Language: TypeScript

Configuration
Edit tailwind.config.js for theme customization
Modify route.ts for AI response handling
Adjust components for UI components
Configure CodeMirror/Monaco settings in their respective components
📝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📄 License
MIT License - feel free to use this project for any purpose.

🙏 Acknowledgments
Google Gemini for AI capabilities
Vercel for the AI SDK and hosting platform
CodeSandbox for Sandpack
All other open-source contributors I SDK UI
useChat
useChat()
Allows you to easily create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.

Import
React
Svelte
Vue
Solid
import { useChat } from '@ai-sdk/react'
API Signature
Parameters
api?:
string = '/api/chat'
The API endpoint that is called to generate chat responses. It can be a relative path (starting with `/`) or an absolute URL.
id?:
string
An unique identifier for the chat. If not provided, a random one will be generated. When provided, the `useChat` hook with the same `id` will have shared states across components. This is useful when you have multiple components showing the same chat stream.
initialInput?:
string = ''
An optional string for the initial prompt input.
initialMessages?:
Messages[] = []
An optional array of initial chat messages
onToolCall?:
({toolCall: ToolCall}) => void | unknown| Promise<unknown>
Optional callback function that is invoked when a tool call is received. Intended for automatic client-side tool execution. You can optionally return a result for the tool call, either synchronously or asynchronously.
onResponse?:
(response: Response) => void
An optional callback that will be called with the response from the API endpoint. Useful for throwing customized errors or logging
onFinish?:
(message: Message, options: OnFinishOptions) => void
An optional callback function that is called when the completion stream ends.
OnFinishOptions
usage:
CompletionTokenUsage
The token usage for the completion.
CompletionTokenUsage
promptTokens:
number
The total number of tokens in the prompt.
completionTokens:
number
The total number of tokens in the completion.
totalTokens:
number
The total number of tokens generated.
finishReason:
'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'
The reason why the generation ended.
onError?:
(error: Error) => void
A callback that will be called when the chat stream encounters an error. Optional.
generateId?:
() => string
A custom id generator for message ids and the chat id. Optional.
headers?:
Record<string, string> | Headers
Additional headers to be passed to the API endpoint. Optional.
body?:
any
Additional body object to be passed to the API endpoint. Optional.
credentials?:
'omit' | 'same-origin' | 'include'
An optional literal that sets the mode of credentials to be used on the request. Defaults to same-origin.
sendExtraMessageFields?:
boolean
An optional boolean that determines whether to send extra fields you've added to `messages`. Defaults to `false` and only the `content` and `role` fields will be sent to the API endpoint. If set to `true`, the `name`, `data`, and `annotations` fields will also be sent.
maxSteps?:
number
Maximum number of backend calls to generate a response. A maximum number is required to prevent infinite loops in the case of misconfigured tools. By default, it is set to 1.
streamProtocol?:
'text' | 'data'
An optional literal that sets the type of stream to be used. Defaults to `data`. If set to `text`, the stream will be treated as a text stream.
fetch?:
FetchFunction
Optional. A custom fetch function to be used for the API call. Defaults to the global fetch function.
experimental_prepareRequestBody?:
(options: { messages: UIMessage[]; requestData?: JSONValue; requestBody?: object, id: string }) => unknown
Experimental (React, Solid & Vue only). When a function is provided, it will be used to prepare the request body for the chat API. This can be useful for customizing the request body based on the messages and data in the chat.
experimental_throttle?:
number
React only. Custom throttle wait time in milliseconds for the message and data updates. When specified, updates will be throttled using this interval. Defaults to undefined (no throttling).
Returns
messages:
UIMessage[]
The current array of chat messages.
UIMessage
id:
string
The unique identifier of the message.
role:
'system' | 'user' | 'assistant' | 'data'
The role of the message.
createdAt?:
Date
The creation date of the message.
content:
string
The content of the message.
annotations?:
Array<JSONValue>
Additional annotations sent along with the message.
parts:
Array<TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart | StepStartUIPart>
An array of message parts that are associated with the message.
TextUIPart
type:
"text"
text:
string
The text content of the part.
ReasoningUIPart
type:
"reasoning"
reasoning:
string
The reasoning content of the part.
ToolInvocationUIPart
type:
"tool-invocation"
toolInvocation:
ToolInvocation
ToolInvocation
state:
'partial-call'
The state of the tool call when it was partially created.
toolCallId:
string
ID of the tool call. This ID is used to match the tool call with the tool result.
toolName:
string
Name of the tool that is being called.
args:
any
Partial arguments of the tool call. This is a JSON-serializable object.
ToolInvocation
state:
'call'
The state of the tool call when it was fully created.
toolCallId:
string
ID of the tool call. This ID is used to match the tool call with the tool result.
toolName:
string
Name of the tool that is being called.
args:
any
Arguments of the tool call. This is a JSON-serializable object that matches the tools input schema.
ToolInvocation
state:
'result'
The state of the tool call when the result is available.
toolCallId:
string
ID of the tool call. This ID is used to match the tool call with the tool result.
toolName:
string
Name of the tool that is being called.
args:
any
Arguments of the tool call. This is a JSON-serializable object that matches the tools input schema.
result:
any
The result of the tool call.
SourceUIPart
type:
"source"
source:
Source
Source
sourceType:
'url'
The type of the source.
id:
string
ID of the source.
url:
string
URL of the source.
title?:
string
The title of the source.
StepStartUIPart
type:
"step-start"
experimental_attachments?:
Array<Attachment>
Additional attachments sent along with the message.
Attachment
name?:
string
The name of the attachment, usually the file name.
contentType?:
string
A string indicating the media type of the file.
url:
string
The URL of the attachment. It can either be a URL to a hosted file or a Data URL.
error:
Error | undefined
An error object returned by SWR, if any.
append:
(message: Message | CreateMessage, options?: ChatRequestOptions) => Promise<string | undefined>
Function to append a message to the chat, triggering an API call for the AI response. It returns a promise that resolves to full response message content when the API call is successfully finished, or throws an error when the API call fails.
ChatRequestOptions
headers:
Record<string, string> | Headers
Additional headers that should be to be passed to the API endpoint.
body:
object
Additional body JSON properties that should be sent to the API endpoint.
data:
JSONValue
Additional data to be sent to the API endpoint.
experimental_attachments?:
FileList | Array<Attachment>
An array of attachments to be sent to the API endpoint.
FileList
A list of files that have been selected by the user using an <input type='file'> element. It's also used for a list of files dropped into web content when using the drag and drop API.
Attachment
name?:
string
The name of the attachment, usually the file name.
contentType?:
string
A string indicating the media type of the file.
url:
string
The URL of the attachment. It can either be a URL to a hosted file or a Data URL.
reload:
(options?: ChatRequestOptions) => Promise<string | undefined>
Function to reload the last AI chat response for the given chat history. If the last message isn't from the assistant, it will request the API to generate a new response.
ChatRequestOptions
headers:
Record<string, string> | Headers
Additional headers that should be to be passed to the API endpoint.
body:
object
Additional body JSON properties that should be sent to the API endpoint.
data:
JSONValue
Additional data to be sent to the API endpoint.
stop:
() => void
Function to abort the current API request.
experimental_resume:
() => void
Function to resume an ongoing chat generation stream.
setMessages:
(messages: Message[] | ((messages: Message[]) => Message[]) => void
Function to update the `messages` state locally without triggering an API call.
input:
string
The current value of the input field.
setInput:
React.Dispatch<React.SetStateAction<string>>
Function to update the `input` value.
handleInputChange:
(event: any) => void
Handler for the `onChange` event of the input field to control the input's value.
handleSubmit:
(event?: { preventDefault?: () => void }, options?: ChatRequestOptions) => void
Form submission handler that automatically resets the input field and appends a user message. You can use the `options` parameter to send additional data, headers and more to the server.
ChatRequestOptions
headers:
Record<string, string> | Headers
Additional headers that should be to be passed to the API endpoint.
body:
object
Additional body JSON properties that should be sent to the API endpoint.
data:
JSONValue
Additional data to be sent to the API endpoint.
allowEmptySubmit?:
boolean
A boolean that determines whether to allow submitting an empty input that triggers a generation. Defaults to `false`.
experimental_attachments?:
FileList | Array<Attachment>
An array of attachments to be sent to the API endpoint.
FileList
A list of files that have been selected by the user using an <input type='file'> element. It's also used for a list of files dropped into web content when using the drag and drop API.
Attachment
name?:
string
The name of the attachment, usually the file name.
contentType?:
string
A string indicating the media type of the file.
url:
string
The URL of the attachment. It can either be a URL to a hosted file or a Data URL.
status:
"submitted" | "streaming" | "ready" | "error"
Status of the chat request: submitted (message sent to API), streaming (receiving response chunks), ready (response complete), or error (request failed).
id:
string
The unique identifier of the chat.
data:
JSONValue[]
Data returned from StreamData.
setData:
(data: JSONValue[] | undefined | ((data: JSONValue[] | undefined) => JSONValue[] | undefined)) => void
Function to update the `data` state which contains data from StreamData.
addToolResult:
({toolCallId: string; result: any;}) => void
Function to add a tool result to the chat. This will update the chat messages with the tool result and call the API route if all tool results for the last message are available. AI SDK UI
AI SDK UI is designed to help you build interactive chat, completion, and assistant applications with ease. It is a framework-agnostic toolkit, streamlining the integration of advanced AI functionalities into your applications.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently. With four main hooks — useChat, useCompletion, useObject, and useAssistant — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

useChat offers real-time streaming of chat messages, abstracting state management for inputs, messages, loading, and errors, allowing for seamless integration into any UI design.
useCompletion enables you to handle text completions in your applications, managing the prompt input and automatically updating the UI as new completions are streamed.
useObject is a hook that allows you to consume streamed JSON objects, providing a simple way to handle and display structured data in your application.
useAssistant is designed to facilitate interaction with OpenAI-compatible assistant APIs, managing UI state and updating it automatically as responses are streamed.
These hooks are designed to reduce the complexity and time required to implement AI interactions, letting you focus on creating exceptional user experiences.

UI Framework Support
AI SDK UI supports the following frameworks: React, Svelte, Vue.js, and SolidJS (deprecated). Here is a comparison of the supported functions across these frameworks:

Function	React	Svelte	Vue.js	SolidJS (deprecated)
useChat		 Chat		
useCompletion		 Completion		
useObject		 StructuredObject		
useAssistant				
 AI SDK Core
generateText
generateText()
Generates text and calls tools for a given prompt using a language model.

It is ideal for non-interactive use cases such as automation tasks where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.


import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Invent a new holiday and describe its traditions.',
});

console.log(text);
To see generateText in action, check out these examples.

Import
import { generateText } from "ai"
API Signature
Parameters
model:
LanguageModel
The language model to use. Example: openai('gpt-4o')
system:
string
The system prompt to use that specifies the behavior of the model.
prompt:
string
The input prompt to generate the text from.
messages:
Array<CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage> | Array<UIMessage>
A list of messages that represent a conversation. Automatically converts UI messages from the useChat hook.
CoreSystemMessage
role:
'system'
The role for the system message.
content:
string
The content of the message.
CoreUserMessage
role:
'user'
The role for the user message.
content:
string | Array<TextPart | ImagePart | FilePart>
The content of the message.
TextPart
type:
'text'
The type of the message part.
text:
string
The text content of the message part.
ImagePart
type:
'image'
The type of the message part.
image:
string | Uint8Array | Buffer | ArrayBuffer | URL
The image content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.
mimeType?:
string
The mime type of the image. Optional.
FilePart
type:
'file'
The type of the message part.
data:
string | Uint8Array | Buffer | ArrayBuffer | URL
The file content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.
mimeType:
string
The mime type of the file.
CoreAssistantMessage
role:
'assistant'
The role for the assistant message.
content:
string | Array<TextPart | ReasoningPart | RedactedReasoningPart | ToolCallPart>
The content of the message.
TextPart
type:
'text'
The type of the message part.
text:
string
The text content of the message part.
ReasoningPart
type:
'reasoning'
text:
string
The reasoning text.
signature?:
string
The signature for the reasoning.
RedactedReasoningPart
type:
'redacted-reasoning'
data:
string
The redacted data.
ToolCallPart
type:
'tool-call'
The type of the message part.
toolCallId:
string
The id of the tool call.
toolName:
string
The name of the tool, which typically would be the name of the function.
args:
object based on zod schema
Parameters generated by the model to be used by the tool.
CoreToolMessage
role:
'tool'
The role for the assistant message.
content:
Array<ToolResultPart>
The content of the message.
ToolResultPart
type:
'tool-result'
The type of the message part.
toolCallId:
string
The id of the tool call the result corresponds to.
toolName:
string
The name of the tool the result corresponds to.
result:
unknown
The result returned by the tool after execution.
isError?:
boolean
Whether the result is an error or an error message.
tools:
ToolSet
Tools that are accessible to and can be called by the model. The model needs to support calling tools.
Tool
description?:
string
Information about the purpose of the tool including details on how and when it can be used by the model.
parameters:
Zod Schema | JSON Schema
The schema of the input that the tool expects. The language model will use this to generate the input. It is also used to validate the output of the language model. Use descriptions to make the input understandable for the language model. You can either pass in a Zod schema or a JSON schema (using the `jsonSchema` function).
execute?:
async (parameters: T, options: ToolExecutionOptions) => RESULT
An async function that is called with the arguments from the tool call and produces a result. If not provided, the tool will not be executed automatically.
ToolExecutionOptions
toolCallId:
string
The ID of the tool call. You can use it e.g. when sending tool-call related information with stream data.
messages:
CoreMessage[]
Messages that were sent to the language model to initiate the response that contained the tool call. The messages do not include the system prompt nor the assistant response that contained the tool call.
abortSignal:
AbortSignal
An optional abort signal that indicates that the overall operation should be aborted.
toolChoice?:
"auto" | "none" | "required" | { "type": "tool", "toolName": string }
The tool choice setting. It specifies how tools are selected for execution. The default is "auto". "none" disables tool execution. "required" requires tools to be executed. { "type": "tool", "toolName": string } specifies a specific tool to execute.
maxTokens?:
number
Maximum number of tokens to generate.
temperature?:
number
Temperature setting. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either `temperature` or `topP`, but not both.
topP?:
number
Nucleus sampling. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either `temperature` or `topP`, but not both.
topK?:
number
Only sample from the top K options for each subsequent token. Used to remove "long tail" low probability responses. Recommended for advanced use cases only. You usually only need to use temperature.
presencePenalty?:
number
Presence penalty setting. It affects the likelihood of the model to repeat information that is already in the prompt. The value is passed through to the provider. The range depends on the provider and model.
frequencyPenalty?:
number
Frequency penalty setting. It affects the likelihood of the model to repeatedly use the same words or phrases. The value is passed through to the provider. The range depends on the provider and model.
stopSequences?:
string[]
Sequences that will stop the generation of the text. If the model generates any of these sequences, it will stop generating further text.
seed?:
number
The seed (integer) to use for random sampling. If set and supported by the model, calls will generate deterministic results.
maxRetries?:
number
Maximum number of retries. Set to 0 to disable retries. Default: 2.
abortSignal?:
AbortSignal
An optional abort signal that can be used to cancel the call.
headers?:
Record<string, string>
Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.
maxSteps?:
number
Maximum number of sequential LLM calls (steps), e.g. when you use tool calls. A maximum number is required to prevent infinite loops in the case of misconfigured tools. By default, it is set to 1.
experimental_generateMessageId?:
() => string
Function used to generate a unique ID for each message. This is an experimental feature.
experimental_continueSteps?:
boolean
Enable or disable continue steps. Disabled by default.
experimental_telemetry?:
TelemetrySettings
Telemetry configuration. Experimental feature.
TelemetrySettings
isEnabled?:
boolean
Enable or disable telemetry. Disabled by default while experimental.
recordInputs?:
boolean
Enable or disable input recording. Enabled by default.
recordOutputs?:
boolean
Enable or disable output recording. Enabled by default.
functionId?:
string
Identifier for this function. Used to group telemetry data by function.
metadata?:
Record<string, string | number | boolean | Array<null | undefined | string> | Array<null | undefined | number> | Array<null | undefined | boolean>>
Additional information to include in the telemetry data.
providerOptions?:
Record<string,Record<string,JSONValue>> | undefined
Provider-specific options. The outer key is the provider name. The inner values are the metadata. Details depend on the provider.
experimental_activeTools?:
Array<TOOLNAME> | undefined
The tools that are currently active. All tools are active by default.
experimental_repairToolCall?:
(options: ToolCallRepairOptions) => Promise<LanguageModelV1FunctionToolCall | null>
A function that attempts to repair a tool call that failed to parse. Return either a repaired tool call or null if the tool call cannot be repaired.
ToolCallRepairOptions
system:
string | undefined
The system prompt.
messages:
CoreMessage[]
The messages in the current generation step.
toolCall:
LanguageModelV1FunctionToolCall
The tool call that failed to parse.
tools:
TOOLS
The tools that are available.
parameterSchema:
(options: { toolName: string }) => JSONSchema7
A function that returns the JSON Schema for a tool.
error:
NoSuchToolError | InvalidToolArgumentsError
The error that occurred while parsing the tool call.
experimental_output?:
Output
Experimental setting for generating structured outputs.
Output
Output.text():
Output
Forward text output.
Output.object():
Output
Generate a JSON object of type OBJECT.
Options
schema:
Schema<OBJECT>
The schema of the JSON object to generate.
onStepFinish?:
(result: OnStepFinishResult) => Promise<void> | void
Callback that is called when a step is finished.
OnStepFinishResult
stepType:
"initial" | "continue" | "tool-result"
The type of step. The first step is always an "initial" step, and subsequent steps are either "continue" steps or "tool-result" steps.
finishReason:
"stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | "unknown"
The reason the model finished generating the text for the step.
usage:
TokenUsage
The token usage of the step.
TokenUsage
promptTokens:
number
The total number of tokens in the prompt.
completionTokens:
number
The total number of tokens in the completion.
totalTokens:
number
The total number of tokens generated.
text:
string
The full text that has been generated.
toolCalls:
ToolCall[]
The tool calls that have been executed.
toolResults:
ToolResult[]
The tool results that have been generated.
warnings:
Warning[] | undefined
Warnings from the model provider (e.g. unsupported settings).
response?:
Response
Response metadata.
Response
id:
string
The response identifier. The AI SDK uses the ID from the provider response when available, and generates an ID otherwise.
model:
string
The model that was used to generate the response. The AI SDK uses the response model from the provider response when available, and the model from the function call otherwise.
timestamp:
Date
The timestamp of the response. The AI SDK uses the response timestamp from the provider response when available, and creates a timestamp otherwise.
headers?:
Record<string, string>
Optional response headers.
body?:
unknown
Optional response body.
isContinued:
boolean
True when there will be a continuation step with a continuation text.
providerMetadata?:
Record<string,Record<string,JSONValue>> | undefined
Optional metadata from the provider. The outer key is the provider name. The inner values are the metadata. Details depend on the provider.
Returns
text:
string
The generated text by the model.
reasoning:
string | undefined
The reasoning text of the model (only available for some models).
reasoningDetails:
Array<ReasoningDetail>
The reasoning details of the model (only available for some models).
ReasoningDetail
type:
'text'
The type of the reasoning detail.
text:
string
The text content (only for type "text").
signature?:
string
Optional signature (only for type "text").
ReasoningDetail
type:
'redacted'
The type of the reasoning detail.
data:
string
The redacted data content (only for type "redacted").
sources:
Array<Source>
Sources that have been used as input to generate the response. For multi-step generation, the sources are accumulated from all steps.
Source
sourceType:
'url'
A URL source. This is return by web search RAG models.
id:
string
The ID of the source.
url:
string
The URL of the source.
title?:
string
The title of the source.
providerMetadata?:
LanguageModelV1ProviderMetadata
Additional provider metadata for the source.
files:
Array<GeneratedFile>
Files that were generated in the final step.
GeneratedFile
base64:
string
File as a base64 encoded string.
uint8Array:
Uint8Array
File as a Uint8Array.
mimeType:
string
MIME type of the file.
toolCalls:
array
A list of tool calls made by the model.
toolResults:
array
A list of tool results returned as responses to earlier tool calls.
finishReason:
'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'
The reason the model finished generating the text.
usage:
CompletionTokenUsage
The token usage of the generated text.
CompletionTokenUsage
promptTokens:
number
The total number of tokens in the prompt.
completionTokens:
number
The total number of tokens in the completion.
totalTokens:
number
The total number of tokens generated.
request?:
RequestMetadata
Request metadata.
RequestMetadata
body:
string
Raw request HTTP body that was sent to the provider API as a string (JSON should be stringified).
response?:
ResponseMetadata
Response metadata.
ResponseMetadata
id:
string
The response identifier. The AI SDK uses the ID from the provider response when available, and generates an ID otherwise.
model:
string
The model that was used to generate the response. The AI SDK uses the response model from the provider response when available, and the model from the function call otherwise.
timestamp:
Date
The timestamp of the response. The AI SDK uses the response timestamp from the provider response when available, and creates a timestamp otherwise.
headers?:
Record<string, string>
Optional response headers.
body?:
unknown
Optional response body.
messages:
Array<ResponseMessage>
The response messages that were generated during the call. It consists of an assistant message, potentially containing tool calls. When there are tool results, there is an additional tool message with the tool results that are available. If there are tools that do not have execute functions, they are not included in the tool results and need to be added separately.
warnings:
Warning[] | undefined
Warnings from the model provider (e.g. unsupported settings).
providerMetadata:
Record<string,Record<string,JSONValue>> | undefined
Optional metadata from the provider. The outer key is the provider name. The inner values are the metadata. Details depend on the provider.
experimental_output?:
Output
Experimental setting for generating structured outputs.
steps:
Array<StepResult>
Response information for every step. You can use this to get information about intermediate steps, such as the tool calls or the response headers.
StepResult
stepType:
"initial" | "continue" | "tool-result"
The type of step. The first step is always an "initial" step, and subsequent steps are either "continue" steps or "tool-result" steps.
text:
string
The generated text by the model.
reasoning:
string | undefined
The reasoning text of the model (only available for some models).
reasoningDetails:
Array<ReasoningDetail>
The reasoning details of the model (only available for some models).
ReasoningDetail
type:
'text'
The type of the reasoning detail.
text:
string
The text content (only for type "text").
signature?:
string
Optional signature (only for type "text").
ReasoningDetail
type:
'redacted'
The type of the reasoning detail.
data:
string
The redacted data content (only for type "redacted").
sources:
Array<Source>
Sources that have been used as input to generate the response. For multi-step generation, the sources are accumulated from all steps.
Source
sourceType:
'url'
A URL source. This is return by web search RAG models.
id:
string
The ID of the source.
url:
string
The URL of the source.
title?:
string
The title of the source.
providerMetadata?:
LanguageModelV1ProviderMetadata
Additional provider metadata for the source.
files:
Array<GeneratedFile>
Files that were generated in this step.
GeneratedFile
base64:
string
File as a base64 encoded string.
uint8Array:
Uint8Array
File as a Uint8Array.
mimeType:
string
MIME type of the file.
toolCalls:
array
A list of tool calls made by the model.
toolResults:
array
A list of tool results returned as responses to earlier tool calls.
finishReason:
'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'
The reason the model finished generating the text.
usage:
CompletionTokenUsage
The token usage of the generated text.
CompletionTokenUsage
promptTokens:
number
The total number of tokens in the prompt.
completionTokens:
number
The total number of tokens in the completion.
totalTokens:
number
The total number of tokens generated.
request?:
RequestMetadata
Request metadata.
RequestMetadata
body:
string
Raw request HTTP body that was sent to the provider API as a string (JSON should be stringified).
response?:
ResponseMetadata
Response metadata.
ResponseMetadata
id:
string
The response identifier. The AI SDK uses the ID from the provider response when available, and generates an ID otherwise.
model:
string
The model that was used to generate the response. The AI SDK uses the response model from the provider response when available, and the model from the function call otherwise.
timestamp:
Date
The timestamp of the response. The AI SDK uses the response timestamp from the provider response when available, and creates a timestamp otherwise.
headers?:
Record<string, string>
Optional response headers.
body?:
unknown
Optional response body.
messages:
Array<ResponseMessage>
The response messages that were generated during the call. It consists of an assistant message, potentially containing tool calls. When there are tool results, there is an additional tool message with the tool results that are available. If there are tools that do not have execute functions, they are not included in the tool results and need to be added separately.
warnings:
Warning[] | undefined
Warnings from the model provider (e.g. unsupported settings).
isContinued:
boolean
True when there will be a continuation step with a continuation text.
providerMetadata?:
Record<string,Record<string,JSONValue>> | undefined
Optional metadata from the provider. The outer key is the provider name. The inner values are the metadata. Details depend on the provider.  Reference

AI SDK Core

generateText
streamText
generateObject
streamObject
embed
embedMany
generateImage
transcribe
generateSpeech
tool
experimental_createMCPClient
Experimental_StdioMCPTransport
jsonSchema
zodSchema
valibotSchema
CoreMessage
createProviderRegistry
customProvider
cosineSimilarity
wrapLanguageModel
LanguageModelV1Middleware
extractReasoningMiddleware
simulateStreamingMiddleware
defaultSettingsMiddleware
simulateReadableStream
smoothStream
generateId
createIdGenerator
AI SDK UI

useChat
useCompletion
useObject
useAssistant
AssistantResponse
convertToCoreMessages
appendResponseMessages
appendClientMessage
createDataStream
createDataStreamResponse
pipeDataStreamToResponse
StreamData AI SDK RSC
streamUI
streamUI
AI SDK RSC is currently experimental. We recommend using AI SDK UI for production. For guidance on migrating from RSC to UI, see our migration guide.

A helper function to create a streamable UI from LLM providers. This function is similar to AI SDK Core APIs and supports the same model interfaces.

To see streamUI in action, check out these examples.

Import
import { streamUI } from "ai/rsc"
Parameters
model:
LanguageModel
The language model to use. Example: openai("gpt-4-turbo")
initial?:
ReactNode
The initial UI to render.
system:
string
The system prompt to use that specifies the behavior of the model.
prompt:
string
The input prompt to generate the text from.
messages:
Array<CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage> | Array<UIMessage>
A list of messages that represent a conversation. Automatically converts UI messages from the useChat hook.
CoreSystemMessage
role:
'system'
The role for the system message.
content:
string
The content of the message.
CoreUserMessage
role:
'user'
The role for the user message.
content:
string | Array<TextPart | ImagePart | FilePart>
The content of the message.
TextPart
type:
'text'
The type of the message part.
text:
string
The text content of the message part.
ImagePart
type:
'image'
The type of the message part.
image:
string | Uint8Array | Buffer | ArrayBuffer | URL
The image content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.
mimeType?:
string
The mime type of the image. Optional.
FilePart
type:
'file'
The type of the message part.
data:
string | Uint8Array | Buffer | ArrayBuffer | URL
The file content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.
mimeType:
string
The mime type of the file.
CoreAssistantMessage
role:
'assistant'
The role for the assistant message.
content:
string | Array<TextPart | ToolCallPart>
The content of the message.
TextPart
type:
'text'
The type of the message part.
text:
string
The text content of the message part.
ToolCallPart
type:
'tool-call'
The type of the message part.
toolCallId:
string
The id of the tool call.
toolName:
string
The name of the tool, which typically would be the name of the function.
args:
object based on zod schema
Parameters generated by the model to be used by the tool.
CoreToolMessage
role:
'tool'
The role for the assistant message.
content:
Array<ToolResultPart>
The content of the message.
ToolResultPart
type:
'tool-result'
The type of the message part.
toolCallId:
string
The id of the tool call the result corresponds to.
toolName:
string
The name of the tool the result corresponds to.
result:
unknown
The result returned by the tool after execution.
isError?:
boolean
Whether the result is an error or an error message.
maxTokens?:
number
Maximum number of tokens to generate.
temperature?:
number
Temperature setting. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either `temperature` or `topP`, but not both.
topP?:
number
Nucleus sampling. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either `temperature` or `topP`, but not both.
topK?:
number
Only sample from the top K options for each subsequent token. Used to remove "long tail" low probability responses. Recommended for advanced use cases only. You usually only need to use temperature.
presencePenalty?:
number
Presence penalty setting. It affects the likelihood of the model to repeat information that is already in the prompt. The value is passed through to the provider. The range depends on the provider and model.
frequencyPenalty?:
number
Frequency penalty setting. It affects the likelihood of the model to repeatedly use the same words or phrases. The value is passed through to the provider. The range depends on the provider and model.
stopSequences?:
string[]
Sequences that will stop the generation of the text. If the model generates any of these sequences, it will stop generating further text.
seed?:
number
The seed (integer) to use for random sampling. If set and supported by the model, calls will generate deterministic results.
maxRetries?:
number
Maximum number of retries. Set to 0 to disable retries. Default: 2.
abortSignal?:
AbortSignal
An optional abort signal that can be used to cancel the call.
headers?:
Record<string, string>
Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.
tools:
ToolSet
Tools that are accessible to and can be called by the model.
Tool
description?:
string
Information about the purpose of the tool including details on how and when it can be used by the model.
parameters:
zod schema
The typed schema that describes the parameters of the tool that can also be used to validation and error handling.
generate?:
(async (parameters) => ReactNode) | AsyncGenerator<ReactNode, ReactNode, void>
A function or a generator function that is called with the arguments from the tool call and yields React nodes as the UI.
toolChoice?:
"auto" | "none" | "required" | { "type": "tool", "toolName": string }
The tool choice setting. It specifies how tools are selected for execution. The default is "auto". "none" disables tool execution. "required" requires tools to be executed. { "type": "tool", "toolName": string } specifies a specific tool to execute.
text?:
(Text) => ReactNode
Callback to handle the generated tokens from the model.
Text
content:
string
The full content of the completion.
delta:
string
The delta.
done:
boolean
Is it done?
providerOptions?:
Record<string,Record<string,JSONValue>> | undefined
Provider-specific options. The outer key is the provider name. The inner values are the metadata. Details depend on the provider.
onFinish?:
(result: OnFinishResult) => void
Callback that is called when the LLM response and all request tool executions (for tools that have a `generate` function) are finished.
OnFinishResult
usage:
TokenUsage
The token usage of the generated text.
TokenUsage
promptTokens:
number
The total number of tokens in the prompt.
completionTokens:
number
The total number of tokens in the completion.
totalTokens:
number
The total number of tokens generated.
value:
ReactNode
The final ui node that was generated.
warnings:
Warning[] | undefined
Warnings from the model provider (e.g. unsupported settings).
rawResponse:
RawResponse
Optional raw response data.
RawResponse
headers?:
Record<string, string>
Response headers.
Returns
value:
ReactNode
The user interface based on the stream output.
rawResponse?:
RawResponse
Optional raw response data.
RawResponse
headers?:
Record<string, string>
Response headers.
warnings:
Warning[] | undefined
Warnings from the model provider (e.g. unsupported settings).
stream:
AsyncIterable<StreamPart> & ReadableStream<StreamPart>
A stream with all events, including text deltas, tool calls, tool results, and errors. You can use it as either an AsyncIterable or a ReadableStream. When an error occurs, the stream will throw the error.
StreamPart
type:
'text-delta'
The type to identify the object as text delta.
textDelta:
string
The text delta.
StreamPart
type:
'tool-call'
The type to identify the object as tool call.
toolCallId:
string
The id of the tool call.
toolName:
string
The name of the tool, which typically would be the name of the function.
args:
object based on zod schema
Parameters generated by the model to be used by the tool.
StreamPart
type:
'error'
The type to identify the object as error.
error:
Error
Describes the error that may have occurred during execution.
StreamPart
type:
'finish'
The type to identify the object as finish.
finishReason:
'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'
The reason the model finished generating the text.
usage:
TokenUsage
The token usage of the generated text.
TokenUsage
promptTokens:
number
The total number of tokens in the prompt.
completionTokens:
number
The total number of tokens in the completion.
totalTokens:
number
The total number of tokens generated.  AI SDK RSC
createStreamableUI
createStreamableUI
AI SDK RSC is currently experimental. We recommend using AI SDK UI for production. For guidance on migrating from RSC to UI, see our migration guide.

Create a stream that sends UI from the server to the client. On the client side, it can be rendered as a normal React node.

Import
import { createStreamableUI } from "ai/rsc"
API Signature
Parameters
initialValue?:
ReactNode
The initial value of the streamable UI.
Returns
value:
ReactNode
The value of the streamable UI. This can be returned from a Server Action and received by the client.
Methods
update:
(ReactNode) => void
Updates the current UI node. It takes a new UI node and replaces the old one.
append:
(ReactNode) => void
Appends a new UI node to the end of the old one. Once appended a new UI node, the previous UI node cannot be updated anymore.
done:
(ReactNode | null) => void
Marks the UI node as finalized and closes the stream. Once called, the UI node cannot be updated or appended anymore. This method is always required to be called, otherwise the response will be stuck in a loading state.
error:
(Error) => void
Signals that there is an error in the UI stream. It will be thrown on the client side and caught by the nearest error boundary component.  Chat SDK
Chat SDK is a free, open-source template that helps you dive right into building powerful chatbot applications.

How can I assist you today?
Send a message...
Fully customizable
Customize your chatbot to fit the needs of your enterprise business or even your hobby project.

Up to date
Stay up to date with the advancements in user experience and model capabilities like artifacts and reasoning.

Best practices
We ensure the chatbot follows best practices so you can focus on building the important parts. Overview
The Chat SDK is an open-source template that helps you quickly build powerful chatbot applications without starting from scratch. Whether you're launching a small side project or a full-scale enterprise solution, the Chat SDK provides the structure you need to jump right into building your own unique chatbot application.

Features
Next.js App Router
Build on top of the framework that achieves the best performance on the web.
AI SDK
Choose specific models and providers for different parts of your application.
Generative User Interfaces
Go beyond text and enhance your chat responses with user interfaces.
Artifacts
Create custom artifacts that are specific to your workflows and activities.
Code Execution
Run code snippets directly on the browser and display their outputs in either text or images.
Multimodal
Attach files, images, and all the different kinds of media your models support to your chat.
Built-in Authentication
Use email/password authentication to allow your users to register accounts and sign in.
Sharing
Allow your users to share their chats by letting them control their visibilities.  Architecture
A quick overview of the different parts of the Chat SDK

The Chat SDK is powered by several open source libraries to support the different functionalities of the chatbot application like authentication, persistence, text generation, etc. The following is a brief overview of the architecture.



Application Framework
The Chat SDK is built to run fast on the web, so it is powered by Next.js. It uses the App Router with two main route segments – (chat)/ and (auth)/. The api endpoints are located in the api/ folder of each route segment as route handlers which gets converted into serverless functions upon deployment.

Model Providers
The primary user experience of the chatbot application is to simulate a conversation with a model that exhibits near general intelligence and can respond to user queries to help accomplish a task. The Chat SDK uses the AI SDK to connect to these models deployed by various providers.

Language Models are the most primitive types of models used in the application. It is used for generating text and structured data. The AI SDK ships with many features that you can use to amplify your usage of these models like Tool Use, Retrieval Augmented Generation, Reasoning, etc. Image Models and Embedding Models are the other types of models that can be used in the application, like for image generation and document retrieval, respectively.

One of the main advantages of using the AI SDK is that it allows you to be specific with the kind of model and provider you'd like to use in a specific part of the application. You can learn more about it in the Models and Providers section.

Authentication
The Chat SDK uses Auth.js for authentication. The Chat SDK requires authentication by default to start new chats and also save them in history.

Persistence
Persistence is the ability to save and restore data from a database. The Chat SDK uses PostgreSQL as its database to store things like chat history, user accounts, application-wide administrative settings, etc. In order to communicate with the database from route handlers and server actions, the Chat SDK uses Drizzle ORM to connect to the database and run queries.

Since Drizzle ORM supports multiple database providers like Neon and Supabase, it makes it possible for you to swap between databases of your choice without having to modify your queries or schema.

Blob Storage
Blob storage allows your chatbot application to support file uploads to and retrievals from an object store. The Chat SDK uses Vercel Blob to support sending files as attachments in a chat conversation. It can also be used for storing static assets that serve different purposes like uploading an avatar for a user's profile page.

Firewall and Rate Limiting
The API endpoints that the Chat SDK uses have a higher runtime duration and process expensive model tokens (depending on the model). So, any abuse or bot attacks on these endpoints can rack up significant costs quickly. As a result, it is recommended to enable the Vercel Firewall and add rate limiting rules to endpoints like /api/chat.

Alternatively, you can use also use a key value store to track requests and define thresholds to limit usage, you can read more about it here.

Testing
The Chat SDK uses playwright to run E2E tests to simulate the possible user flows in the application and identify any breaking changes as you customize the application. The Chat SDK ships with a few test cases for the most important user flows and we're constantly working on improving the coverage. You can learn more about adding a new test case in the Testing section.

A Closer Look at the Chatbot


1. Initial Navigation to Home Page:

When the user first navigates to the home page and goes through Next.js middleware.
The middleware checks session status:
If no session is found, the user is redirected to /login, authenticating the user with email and password via the /api/auth endpoint.
If a session is available, the user reaches the chat interface with their history restored in the sidebar.
2. Sending a Message:

User composes and submits a message within the chat interface.
Optionally, the user can attach files, which uploads via /api/files/upload, storing the file in Vercel Blob storage. Attachments become accessible through secure URLs returned by Vercel Blob.
Upon submission, the append function from the useChat hook triggers the /api/chat endpoint
After passing the Vercel firewall and its rate limit rules, the message payload is sent to /api/chat.
3. Processing and Model Interaction:

The request to /api/chat routes to a custom model provider, which specifies which models to use for specific parts of the applcation. In this instance, there is one model for title generation and another for chat completion.
Using the AI SDK's streamText function, the chat model is then prompted with the submitted messages and returns the response as a data stream.
The useChat hook on the client reads the data stream and constructs the response to be rendered as assistant messages to the user.
The response messages, now visible to the user, appears within the chat interface.
4. Persisting Response Messages:

After the stream has finished, the onFinish callback is triggered and saves the response messages to the database.
5. User Interaction with Message:

The user can then interact with any of the messages present in the history, performing actions like voting and editing.  Artifacts
Integrate workspaces for activities that involve complex and persistent user interactions

Artifacts is a special user interface mode that allows you to have a workspace like interface along with the chat interface. This is similar to ChatGPT's Canvas and Claude's Artifacts.

The template already ships with the following artifacts:

Text Artifact: Work with text content like drafting essays and emails.
Code Artifact: Write and execute code snippets.
Image Artifact: Work with images like editing, annotating, and processing images.
Sheet Artifact: Work with tabular data like creating, editing, and analyzing data.
Adding a Custom Artifact
To add a custom artifact, you will need to create a folder in the artifacts directory with the artifact name. The folder should contain the following files:

client.tsx: The client-side code for the artifact.
server.ts: The server-side code for the artifact.
Here is an example of a custom artifact called CustomArtifact:


artifacts/
  custom/
    client.tsx
    server.ts
Client-Side Example (client.tsx)
This file is responsible for rendering your custom artifact. You might replace the inner UI with your own components, but the overall pattern (initialization, handling streamed data, and rendering content) remains the same. For instance:


import { Artifact } from "@/components/create-artifact";
import { ExampleComponent } from "@/components/example-component";
import { toast } from "sonner";
 
interface CustomArtifactMetadata {
  // Define metadata your custom artifact might need—the example below is minimal.
  info: string;
}
 
export const customArtifact = new Artifact<"custom", CustomArtifactMetadata>({
  kind: "custom",
  description: "A custom artifact for demonstrating custom functionality.",
  // Initialization can fetch any extra data or perform side effects
  initialize: async ({ documentId, setMetadata }) => {
    // For example, initialize the artifact with default metadata.
    setMetadata({
      info: `Document ${documentId} initialized.`,
    });
  },
  // Handle streamed parts from the server (if your artifact supports streaming updates)
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === "info-update") {
      setMetadata((metadata) => ({
        ...metadata,
        info: streamPart.content as string,
      }));
    }
    if (streamPart.type === "content-update") {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: draftArtifact.content + (streamPart.content as string),
        status: "streaming",
      }));
    }
  },
  // Defines how the artifact content is rendered
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    if (isLoading) {
      return <div>Loading custom artifact...</div>;
    }
 
    if (mode === "diff") {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);
      return (
        <div>
          <h3>Diff View</h3>
          <pre>{oldContent}</pre>
          <pre>{newContent}</pre>
        </div>
      );
    }
 
    return (
      <div className="custom-artifact">
        <ExampleComponent
          content={content}
          metadata={metadata}
          onSaveContent={onSaveContent}
          isCurrentVersion={isCurrentVersion}
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(content);
            toast.success("Content copied to clipboard!");
          }}
        >
          Copy
        </button>
      </div>
    );
  },
  // An optional set of actions exposed in the artifact toolbar.
  actions: [
    {
      icon: <span>⟳</span>,
      description: "Refresh artifact info",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Please refresh the info for my custom artifact.",
        });
      },
    },
  ],
  // Additional toolbar actions for more control
  toolbar: [
    {
      icon: <span>✎</span>,
      description: "Edit custom artifact",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Edit the custom artifact content.",
        });
      },
    },
  ],
});
Server-Side Example (server.ts)

The server file processes the document for the artifact. It streams updates (if applicable) and returns the final content. For example:


import { smoothStream, streamText } from "ai";
import { myProvider } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";
import { updateDocumentPrompt } from "@/lib/ai/prompts";
 
export const customDocumentHandler = createDocumentHandler<"custom">({
  kind: "custom",
  // Called when the document is first created.
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";
    // For demonstration, use streamText to generate content.
    const { fullStream } = streamText({
      model: myProvider.languageModel("artifact-model"),
      system:
        "Generate a creative piece based on the title. Markdown is supported.",
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: title,
    });
 
    // Stream the content back to the client.
    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.textDelta;
        dataStream.writeData({
          type: "content-update",
          content: delta.textDelta,
        });
      }
    }
 
    return draftContent;
  },
  // Called when updating the document based on user modifications.
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";
    const { fullStream } = streamText({
      model: myProvider.languageModel("artifact-model"),
      system: updateDocumentPrompt(document.content, "custom"),
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: description,
      experimental_providerMetadata: {
        openai: {
          prediction: {
            type: "content",
            content: document.content,
          },
        },
      },
    });
 
    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.textDelta;
        dataStream.writeData({
          type: "content-update",
          content: delta.textDelta,
        });
      }
    }
 
    return draftContent;
  },
});
Once you have created the client and server files, you can import the artifact in the lib/artifacts/server.ts file and add it to the documentHandlersByArtifactKind array.


export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  ...,
  customDocumentHandler,
];
 
export const artifactKinds = [..., "custom"] as const;
Specify it in document schema at lib/db/schema.ts.


export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: [..., "custom"] }) // Add the custom artifact kind here
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);
And also add the client-side artifact to the artifactDefinitions array in the components/artifact.tsx file.


import { customArtifact } from "@/artifacts/custom/client";
 
export const artifactDefinitions = [..., customArtifact];
You should now be able to see the custom artifact in the workspace! 
Similar to evaluating LLM themselves, evaluating LLM agents is a challenging task. According to Wang et al., (2023), common evaluation methods include:

Human Annotation: Includes human evaluators that directly score LLM results across different aspects that matter in the application such as honesty, helpfulness, engagement, unbiasedness, and more.
Turing Test: Human evaluators are asked to compare results from real humans and agents where indistinguishable results mean that agents can achieve human-like performance.
Metrics: These are carefully designed metrics that reflect the quality of the agents. Notable metrics include task success metrics, human similarity metrics, and efficiency metrics.
Protocols: Corresponds to common evaluation protocols that determine how the metrics are used. Examples include real-world simulation, social evaluation, multi-task evaluation, and software testing.
Benchmarks: Several benchmarks have been designed to evaluate LLM agents. Notable examples include ALFWorld, IGLU, Tachikuma, AgentBench, SocKET, AgentSims, ToolBench, WebShop, Mobile-Env, WebArena, GentBench, RocoBench, EmotionBench, PEB, ClemBench, and E2E.
Challenges
LLM agents are still in their infancy so there are many challenges and limitations that remain when building them:

Role-playing capability: LLM-based agents typically need to adapt a role to effectively complete tasks in a domain. For roles that the LLM doesn't characterize well, it's possible to fine-tune the LLM on data that represent uncommon roles or psychology characters.
Long-term planning and finite context length: planning over a lengthy history remains a challenge that could lead to errors that the agent may not recover from. LLMs are also limited in context length they can support which could lead to constraints that limit the capabilities of the agent such as leveraging short-term memory.
Generalized human alignment: it's also challenging to align agents with diverse human values which is also common with standard LLMs. A potential solution involves the potential to realign the LLM by designing advanced prompting strategies.
Prompt robustness and reliability: an LLM agent can involve several prompts designed to power the different modules like memory and planning. It's common to encounter reliability issues in LLMs with even the slightest changes to prompts. LLM agents involve an entire prompt framework which makes it more prone to robustness issues. The potential solutions include crafting prompt elements through trial and error, automatically optimizing/tuning prompts, or automatically generating prompts using GPT. Another common issue with LLMs is hallucination which is also prevalent with LLM agents. These agents rely on natural language to interface with external components that could be introducing conflicting information leading to hallucination and factuality issues.
Knowledge boundary: similar to knowledge mismatch issues that could lead to hallucination or factuality issues, it's challenging to control the knowledge scope of LLMs which can significantly impact the effectiveness of simulations. Concretely, an LLM's internal knowledge could introduce biases or utilize user-unknown knowledge that could affect the agent's behavior when operating in specific environments.
Efficiency: LLM agents involve a significant amount of requests that are handled by the LLM which could affect the efficiency of agent actions because it would depend heavily on the LLM inference speed. Cost is also a concern when deploying multiple agents.  RAG for LLMs
LLM Reasoning
RAG Faithfulness
LLM In-Context Recall
RAG Reduces Hallucination
Synthetic Data
ThoughtSculpt
Infini-Attention
LM-Guided CoT
Trustworthiness in LLMs
LLM Tokenization
What is Groq? 
Learn more about advanced prompting methods in our new AI courses. Join now! Use code PROMPTING20 
Evaluating Responses
Before providing a response, the system utilizes the <Thinking /> component to determine the most appropriate approach. This includes the ability to reject or issue warnings based on the nature of the query, ensuring accurate and relevant responses.

Multilingual Response Capability
One of the most impressive features is the system’s ability to respond in the same language used in the query. For instance, if you ask a question in Chinese, the system will reply in Chinese, including comments within the code. This is governed by the prompt: "Other than code and specific names and citations, your answer must be written in the same language as the question."

Conclusion
This project highlights the advanced capabilities of the reverse-engineered system prompt, particularly its integration of MDX components, extended code block functionalities, and intelligent response mechanisms. Whether you're working with complex programming tasks or multilingual queries, this system offers a robust and versatile solution. 

The system includes several predefined MDX components that can be used to enhance the presentation of information:

<LinearProcessFlow />: Ideal for visualizing multi-step processes.
<Quiz />: Perfect for creating interactive questionnaires.
<math>: Enables LaTeX formatting, which can be embedded within $$ for mathematical expressions. 
