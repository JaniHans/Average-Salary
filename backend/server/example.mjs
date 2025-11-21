import OPENAI from "openai";

console.log(process.env.OPENAI_API_KEY)

const client = new OPENAI({
    apiKey : process.env.OPENAI_API_KEY
});

const response = await client.responses.create({
    model : "gpt-5-nano",
    input : "In a very short overview explain the wage trend and forecast the wage trend for the next year whether it might be rising or falling. " +
        "Finally, offer suggestions how to increase your salary. The industry in question is as following :" +
        "Estonian average salary of Forestry and logging, " +
        "2021 average salary 1387 euros, " +
        "2022 average salary rose 1560 euros 12.4% compared to previous year, " +
        "2023 average salary rose to 1667 euros , rose 6.9% compared to previous year and " +
        "2024 average salary rose to 1819 euros 9.1% compared to previous year"
})
console.log(response.output_text)