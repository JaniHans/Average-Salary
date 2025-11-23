import React, {ChangeEvent, useState} from 'react';
import './analyzer.css';
import {DEFAULT, LOADING, requestState} from "../types/response";

type EconomicActivityRecord = Record<string, string>

type SalaryArrayObject = [number, number, number, number, null, number, number, number]
type industrySalaryTuple = [number, number, number, number] | []
type industrySalaryTupleChange = [null, number, number, number] | []

function Analyzer() {

    const [currentState, setCurrentState] = useState<requestState>(DEFAULT)
    const [responseStatus, setResponseStatus] = useState(0);

    const [openAISummary, setOpenAISummary] = useState("");
    const [openAIForecast, setOpenAIForecast] = useState("");
    const [openAIRecommendation, setOpenAIRecommendation] = useState("");
    const [industryCodeActivityRecord, setIndustryCodeActivityRecord] = useState<EconomicActivityRecord>({});
    const [industryCode, setIndustryCode] = useState<string>("");
    const [industryActivity, setIndustryActivity] = useState<string>("");
    const [industrySalary, setIndustrySalary] = useState<industrySalaryTuple>([]);
    const [industrySalaryChangeYearly, setIndustrySalaryChangeYearly] = useState<industrySalaryTupleChange>([]);

    const [salaryTableLoaded, setSalaryTableLoaded] = useState<boolean>(false);


    /**
     * Transform this into a map so we can use later for queries, we need to match ids with economic activities
     * @param idArray - Array of db query ids for a corresponding economic activity
     * @param activityArray - Array of strings for an economic activity
     */
    function addEconomicActivityAndIdToRecord(idArray: [string], activityArray : [string]) {

        let idEconomicActivityObject: EconomicActivityRecord = {};

        for (let i = 0; i < activityArray.length ; i++) {
            if (i === 0) {
                continue;
            }
            idEconomicActivityObject[idArray[i]] = activityArray[i]
        }
        setIndustryCodeActivityRecord(idEconomicActivityObject)
    }
    /**
     * Convert first four elements to a industry salary array and the last 4 as a change in percentage
     * @returns {Promise<void>}
     */
    function addIndustrySalaryByYearlyToArray(salaryArrayYearly: any) {
        if (salaryArrayYearly.length < 1) {
            throw Error("No data available for " + industryCodeActivityRecord[industryCode]);
        }

        const salary : industrySalaryTuple = salaryArrayYearly.slice(0, 4);
        const change : industrySalaryTupleChange = salaryArrayYearly.slice(4, salaryArrayYearly.length);

        setIndustrySalary([...salary])
        setIndustrySalaryChangeYearly([...change])
    }
    const getUrlQueryForDifferentDatabases = async () => {
        try {
            const response = await fetch("https://andmed.stat.ee/api/v1/en/stat/majandus/palk-ja-toojeukulu/palk/aastastatistika")
            if (!response.ok) {
                console.log("Where is the response")
                console.log(response)
                throw new Error(`Response status : `)
            }
            const result = await response.json();
            console.log("How it looks")
            console.log(result);

        } catch (e) {
            console.log(e)
        }
    }

    /**
     * @URL -source https://andmed.stat.ee/api/v1/en/stat/majandus/palk-ja-toojeukulu/palk/aastastatistika
     * @POST Query - PA103
     * @returns {Promise<void>}
     */
    const categorizeIndustriesByActivityAndCodes = async () => {
        try {
            const response = await fetch("https://andmed.stat.ee/api/v1/en/stat/PA103")
            if (!response.ok) {
                throw new Error(`Response status :  `)
            }
            const result = await response.json();
            console.log("This is the object that is printed below")
            console.log(result);

            const industryObject = result.variables[1];
            const industryArray = industryObject.valueTexts;
            const industryArrayIds = industryObject.values;
            // transform to map
            addEconomicActivityAndIdToRecord(industryArrayIds, industryArray);
        } catch (e) {
            console.log(e)
        }
    }


    const getSalaryByCategory = async () => {
        try {
            const response = await fetch("https://andmed.stat.ee/api/v1/en/stat/PA103", {
                method : "POST",
                body : JSON.stringify(
                    {
                        "query" : [
                            {
                                "code" : "Tegevusala",
                                "selection" : {
                                    "filter" : "item",
                                    "values" : [
                                        `${industryCode}`
                                    ]
                                }
                            },
                            {
                                "code" : "Näitaja",
                                "selection" : {
                                    "filter" : "item",
                                    "values" : [
                                        'GR_W_AVG', 'GR_W_AVG_SM'
                                    ]
                                }
                            },
                        ],
                        "response" : {
                            "format" : "json-stat2"
                        }
                    })
            })
            if (!response.ok) {
                console.log(response)
                throw new Error(`Response status :  ${setResponseStatus(response.status)}`)
            }

            const result = await response.json();
            console.log(result.value)
            const salaries : SalaryArrayObject = result.value;
            console.log(salaries)
            addIndustrySalaryByYearlyToArray(salaries);
            setSalaryTableLoaded(true);
        } catch (e) {
            console.log(e)
        }

    }

    function handleIndustryChange(e : ChangeEvent<HTMLSelectElement>) {
        console.log(e.target.value)

        const industryCode = e.target.value;
        const industryName = industryCodeActivityRecord[industryCode]
        if (industryCode.startsWith("default")) {
            return;
        }
        setOpenAISummary("");
        setOpenAIForecast("");
        setOpenAIRecommendation("");
        setIndustryCode(industryCode);
        setIndustryActivity(industryName)

    }

    function transformAIAnalysisIntoDifferentStatesForFormatting(summary : string){

        const indexOverview = summary.indexOf("OVERVIEW");
        const indexForecast = summary.indexOf("FORECAST");
        const indexRec = summary.indexOf("ANALYSIS")

        const overview = summary.substring(indexOverview + 8, indexForecast);

        const forecast = summary.substring(summary.lastIndexOf("FORECAST") + 9, summary.indexOf("ANALYSIS"))
        const recommendations = summary.substring(summary.lastIndexOf("ANALYSIS") + 9);

        setOpenAISummary(overview)
        setOpenAIForecast(forecast);
        setOpenAIRecommendation(recommendations);
        setSalaryTableLoaded(false);
    }

    /**
     * set stateObject with Industry name, salaries and change in percentage
     * @param industryName
     * @param Salary
     * @param Increase
     */
    const convertIndustryNameSalaryAndYearlyIncreaseIntoAnObjectForOpenAi = async () => {

        setCurrentState(LOADING)


    const object = {
        name : industryActivity,
        salaries : industrySalary,
        increase : industrySalaryChangeYearly
    }
        console.log(object)

    try {
        const response = await fetch("http://localhost:3001/openai", {
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify(object)
        })
        if (!response.ok) {
            console.log(response)
        }
        const result = await response.json();

        console.log(result.data)
        transformAIAnalysisIntoDifferentStatesForFormatting(result.data)
    } catch (error) {
        console.log(error)
    }
    }


    return (
        <div className="main-container">
            <div className="main-container-items">
                <div className="text-container">
                    <h3>Average salaries in Estonia powered by Statistics Estonia and OpenAI</h3>
                    <p>Get industry average salaries for the last 4 years</p>
                    <p>Use AI to transform your career in the right direction</p>
                    <div className="buttons">
                        <button onClick={categorizeIndustriesByActivityAndCodes}>GET INDUSTRY LIST</button>
                    </div>
                    <div className="industry-container">
                        <div className="industry-container-item" hidden={Object.keys(industryCodeActivityRecord).length === 0}>
                        <label htmlFor="industry-select">Select industry</label>
                        <select defaultValue="" id="industry-select" name="industry-names" onChange={(e : ChangeEvent<HTMLSelectElement>) => handleIndustryChange(e)}>
                            <option value="default">---Choose an option---</option>
                            {
                                industryCodeActivityRecord && Object.entries(industryCodeActivityRecord).map(([key, value]) =>

                                    <option key={key} value={key.toString()}>{value}</option>

                                )
                            }

                        </select>
                        </div>
                        <button hidden={!industryCode} onClick={getSalaryByCategory}>LOAD SALARIES</button>
                        <div>-----------------------------------------</div>
                        {industrySalary.length > 0 &&
                        <table>
                            <thead>
                            <tr>
                                <th>Year</th>
                                <th>Salary</th>
                                <th>Increase</th>
                            </tr>
                            </thead>
                            <tbody>
                            {industrySalary.map((salary, index) => (
                                <>
                                    <tr key={index}></tr>
                                    <td>{2021 + index}</td>
                                    <td>{salary}€</td>
                                    <td>{industrySalaryChangeYearly[index] !== null ? industrySalaryChangeYearly[index] + "%" : "-"}</td>
                                </>
                                ))}
                            </tbody>
                        </table>
                        }
                        <button hidden={!salaryTableLoaded} onClick={convertIndustryNameSalaryAndYearlyIncreaseIntoAnObjectForOpenAi}>LOAD AI Analysis</button>
                        {openAISummary.length > 100 &&
                            <div>
                                <h3>Overview</h3>
                        <p>{openAISummary}</p>
                                <h3>Forecast</h3>
                        <p>{openAIForecast}</p>
                                <h3>Analysis</h3>
                    <p>{openAIRecommendation}</p>
                            </div>
                    }

                    </div>
                </div>
            </div>
        </div>

    );
}

export default Analyzer;