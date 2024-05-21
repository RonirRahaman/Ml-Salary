import React, { useState } from 'react';
import { OpenAI } from 'openai';
import JsonData from '../../Assets/salary.json';

const OpenAiChat: React.FC = () => {
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    // console.log('API Key:', openaiApiKey);

    if (!openaiApiKey) {
        throw new Error("API key is not defined");
    }

    const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true,
    });

    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');

    const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleSendMessage = async () => {
        if (!userInput) return;

        try {
            const prompt = `
                You are a world class business development representative. 
                I will share a prospect's message with you and you will give me the best answer that 
                I should send to this prospect based on past best practies, 
                and you will follow ALL of the rules below:

                1/ Response should be very similar from our json data given, 
                in terms of length, ton of voice, logical arguments and other details

                2/ If the best practice are irrelevant, then try to mimic the style of the best practice to prospect's message

                Below is a message I received from the prospect:
                ${userInput}

                Here is a json data related to our topic an it has all the information needed:
                ${JSON.stringify(JsonData)}

                Please write the best response that I should send to this prospect:
                `;

            const gptResponse = await openai.completions.create({
                model: 'gpt-3.5-turbo-16k-0613',
                prompt,
                temperature: 0.7,
            });

            setResponse(gptResponse.choices[0].text);
        } catch (error) {
            console.error('Error making OpenAI request:', error);
            setResponse('Incorrect API key provided');
        }
    };

    return (
        <div className="openAiChatBot px-5 pb-5">
            <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Chat With Our Operator
            </h1>
            <div className="flex flex-col items-center pt-2">
                <div className="shadow-lg rounded bg-sky-700 w-full md:w-6/12 flex justify-center h-40 overflow-auto">
                    {response && <p className="text-gray-900 dark:text-white" >{response}</p>}
                </div>
                <div className="w-full md:w-6/12 flex justify-center pt-3">
                    <input
                        type="search"
                        id="default-search"
                        value={userInput}
                        onChange={handleUserInputChange}
                        placeholder="Enter your message..."
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                    <button
                        onClick={handleSendMessage}
                        type="submit"
                        className="text-white ml-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OpenAiChat;
