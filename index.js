const { Configuration, OpenAIApi } = require('openai');

process.on('SIGINT', () => {
  console.log('\nFinished');
  process.exit(0);
});

/**
 * Read Text
 * 
 * @param {string} message Prompt Message
 * @return {Promise<string>} User Input
 */
const readText = async (message = 'Please Input > ') => {
  process.stdout.write(message);
  process.stdin.resume();
  let text = '';
  try {
    text = await new Promise(resolve => process.stdin.once('data', resolve));
  }
  finally {
    process.stdin.pause();
  }
  return text.toString().trim();
};

(async () => {
  try {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);
    
    let promptText = '以下は人工知能アシスタントとの会話です。このアシスタントは丁寧で、創造的で、頭が良く、とてもフレンドリーです。\n'
      + 'You: こんにちは、あなたは誰ですか？\n'
      + 'AI: 私はOpenAIによって作られた人工知能です。今日はどうされますか？\n';
    
    while(true) {
      const question = await readText('You: ');
      promptText += `You: ${question}\nAI: `;
      const completion = await openai.createCompletion({
        model            : 'text-davinci-003',
        prompt           : promptText,
        max_tokens       : 256,
        temperature      : .9,
        top_p            : 1,
        stop             : [' You:', ' AI:'],
        presence_penalty : .6,
        frequency_penalty: 0
      });
      promptText += `${completion.data.choices[0].text}\n`;
      console.log(`AI : ${completion.data.choices[0].text.trim()}`);
    }
  }
  catch(error) {
    console.error('ERROR ==========');
    console.error(error);
    console.error('ERROR ==========');
  }
})();
