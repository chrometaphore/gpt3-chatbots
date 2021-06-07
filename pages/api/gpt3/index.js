const OpenAI = require('openai-api')
const ai = new OpenAI(process.env.OPENAI_API_KEY)
const gpt3Templates = require('../../../data/gpt3Templates.json')

export default async function handler(req, res) {

  const { gpt3TemplateName } = req.body
  const { question } = req.body

  const gpt3Template = gpt3Templates.templates.find(template => template.name === gpt3TemplateName)

  if (!gpt3Template) {
    return res.status(500).json({error:`cannot find template "${gpt3TemplateName}"`})
  }

  //compose prompt
  //(context + examples + input prepend + ai prompt prepend)
  //https://beta.openai.com/docs/introduction/prompt-design-101
  const prompt = `${gpt3Template.context}${gpt3Template.examples}${gpt3Template.user_input_prepend}${question}\n${gpt3Template.ai_prompt_prepend}`

  //send request to gpt3
  const gptRes = await ai.complete({
    engine: gpt3Template.settings.engine,
    prompt: prompt,
    temperature: gpt3Template.settings.temperature,
    topP: gpt3Template.settings.topP,
    frequencyPenalty: gpt3Template.settings.frequencyPenalty,
    presencePenalty: gpt3Template.settings.presencePenalty,
    maxTokens: gpt3Template.settings.maxTokens,
    stop: gpt3Template.settings.stop
  })
  res.status(200).json({gpt3:gptRes.data.choices[0].text})

  /*
  const gptRes = `<strong>I heard that Sapporo is very cold in the winter.</strong>
<hr />
<p>Did you know?</p>
<ul>
<li><p>札幌 [さっぽろ,sapporo] - Sapporo</p><em>The city of Sapporo is located in the Tohoku region of Japan and is the capital of Hokkaidō.</em></li>
<li><p>冬 [ふゆ,fuyu] - winter</p><em>The Japanese word for winter is pronounced <strong>fuyu</strong>. Not to be confused with the word for frozen, which is pronounced <strong>hyōri</strong>.</em></li>
</ul>`
  res.status(200).json({gpt3:gptRes})
  */
}
