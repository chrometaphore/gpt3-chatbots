# GPT3 Chatbots

A super-basic Next.js boilerplate meant to provide a simple UI playground to start experimenting with GPT-3 by openAI.
*Note - To use GPT-3, You'll need an openAI API token. If you don't have one, You can join the waitlist here: https://beta.openai.com/*

### Demo
https://vimeo.com/559994420

## Stack

Next.js (Client + Server React Framework)
Evergreen (UI Framework)

## Setup

1. Create a .env.local file in the root folder of your project
2. Open .env.local, add `OPENAI_API_KEY='your own api key'`
3. run `yarn` to install dependencies
4. Standard Next.js commands are now available.
* `yarn dev` - Runs next dev which starts Next.js in development mode
* `yarn build` - Runs next build which builds the application for production usage
* `yarn start` - Runs next start which starts a Next.js production server
5. Open http://localhost:3000/

## GPT3 Templates Setup
You can set up your own gpt3 templates by opening data/gpt3Templates.json

To learn more about how to compose prompts, this is a good place to start:
https://beta.openai.com/docs/introduction/prompt-design-101

A template has the following structure:
```json
{
  "name": "name of the template",
  "context": "this is the initial task description.",
  "examples": "Here you can provide few examples of the task",
  "user_input_prepend":"if you need to prepend a string before the user input, add it here",
  "ai_prompt_prepend":"if you need to prepend a string before the AI output, add it here",
  "settings": {
    "stop": "up to 4 words, API will stop when encountering any of these",
    "engine": "davinci",
    "temperature": 0.7,
    "topP": 1,
    "frequencyPenalty": 0,
    "presencePenalty": 0,
    "maxTokens": 64
  }
}
```
