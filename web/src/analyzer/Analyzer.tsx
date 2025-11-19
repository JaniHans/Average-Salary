import React, {ChangeEvent, useState} from 'react';
import './analyzer.css';


type EconomicActivityObject = Record<string, string>

function Analyzer() {

    const [message, setMessage] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");
    const [responseStatus, setResponseStatus] = useState(0);
    const [industry, setIndustry] = useState<EconomicActivityObject>({});
    const [industryCode, setIndustryCode] = useState<string>("");
    const [industrySalary, setIndustrySalary] = useState([]);

    console.log(industryCode)
    /**
     * Transform this into a map so we can use later for queries, we need to match ids with economic activities
     * @param idArray - Array of db query ids for a corresponding economic activity
     * @param activityArray - Array of strings for an economic activity
     */
    function addEconomicActivityAndIdToMap(idArray: [string], activityArray : [string]) {

        console.log(idArray)
        console.log(activityArray)

        let idEconomicActivityObject: EconomicActivityObject = {};

        for (let i = 0; i < activityArray.length ; i++) {
            if (i === 0) {
                continue;
            }
            idEconomicActivityObject[idArray[i]] = activityArray[i]


        }
        setIndustry(idEconomicActivityObject)

    }

    /**
     *
     * @returns {Promise<void>}
     */
    function addIndustrySalaryByYearlyToArray(salaryArrayYearly: any) {
        //TODO
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
            console.log(result.variables[1])
            const industryObject = result.variables[1];
            const industryArray = industryObject.valueTexts;
            const industryArrayIds = industryObject.values;
            // transform to map
            addEconomicActivityAndIdToMap(industryArrayIds, industryArray);
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
            console.log(result);
        } catch (e) {
            console.log(e)
        }
    }

    // const loadServerMessage = async () => {
    //
    //     if (isError) {
    //         setIsError(false);
    //     }
    //
    //     setIsLoading(true)
    //     setTimeout(async () => {
    //         setIsLoading(false);
    //         try {
    //             const response = await fetch("http://localhost:3001/api");
    //             console.log(response)
    //             if (!response.ok) {
    //                 console.log(response)
    //                 throw new Error(`Response status :
    //             ${setResponseStatus(response.status)}`);
    //             }
    //             const result = await response.json();
    //             setMessage(result.message)
    //
    //         } catch (error) {
    //             console.log(error)
    //             setIsError(true)
    //             setTimeout(() => {
    //                 setErrorMessage(error.message)
    //             }, 2)
    //         }
    //     }, 1000)
    // }

    function handleIndustryChange(e : ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;

        if (value.startsWith("default")) {
            return;
        }
        setIndustryCode(value);

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
                        <label hidden={!industry} htmlFor="industry-select">Select industry</label>
                        <select defaultValue="" hidden={!industry} id="industry-select" name="industry-names" onChange={(e : ChangeEvent<HTMLSelectElement>   ) => handleIndustryChange(e)}>
                            <option value="default">---Choose an option---</option>
                            {
                                industry && Object.entries(industry).map(([key, value]) =>
                                    <option key={key} value={key.toString()}>{value}</option>
                                )
                            }
                        </select>
                        <button hidden={!industryCode} onClick={getSalaryByCategory}>LOAD SALARIES</button>
                    </div>
                </div>



            </div>

        </div>

    );
}

export default Analyzer;