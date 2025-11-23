import OPENAI from "openai";

console.log(process.env.OPENAI_API_KEY)

export const client = new OPENAI({
    apiKey : process.env.OPENAI_API_KEY
});


const industryName = "";
const salary = []
const salaryChangePercentage = []


// const response = await client.responses.create({
//     model : "gpt-5-nano",
//     input : "In a very short overview explain the wage trend and forecast the wage trend for the next year whether it might be rising or falling. " +
//         `Finally, offer suggestions how to increase your salary. Industry Name : ${industryName}` +
//         `Year 2021: ${salary[0]} euros, ` +
//         `Year 2022: ${salary[1]} euros ${salaryChangePercentage[0]} compared to previous year, ` +
//         `Year 2023: ${salary[2]} , rose ${salaryChangePercentage[1]} compared to previous year and ` +
//         `Year 2024: ${salary[3]} euros ${salaryChangePercentage[2]}compared to previous year`
// })
// console.log(response.output_text)