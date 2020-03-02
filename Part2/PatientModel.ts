//FINELLI:

//1. Explain the purpose of the filterLatestReadings function as best as you can.

//FINELLI: filterLastestReadings is a way to loop thru an object of Patient Entries and return an object for one specific metric like "temperature", "weight", or "bloodpressure" to get ONLY the current reading from today, and yesterday's reading. I _think_ the returned 'readings' object should look like this: 

// readings: {
//     weightToday: {
//         id: "1,
//         deleted: false,
//         value: 98.6,
//         type: "",
//         status: "",
//         ts: 03022020
//     },
//     weightLast:  {
//         id: "2,
//         deleted: false,
//         value: 98.6,
//         type: "",
//         status: "",
//         ts: 03022020
//     },
// }
// If I had more time to dedicate to this part of the assignment, my next step would be to mock up some stub data and run this code to further identify what the final outputted object looks like. 

//2. How would you improve the code for readability, maintainability, etc? This can include anything from small changes to rewriting it entirely. Explanations of your reasoning behind your changes is recommended. You can choose to make the changes to the function directly, or to write pseudocode to demonstrate your thinking, or to explain your thoughts in any other way that would effectively convey them to us. 

//FINELLI: 

//There were 2 big improvements that I would consider: 

//FIRST - there were expression like: this.recentMetrics[`${metric}Today`] that would make the code much more readable and concise by turning it into a variable like "metricToday". I explain this further with an example directly in the code below. 
//SECOND - the following expression -- moment().diff(day.ts, 'days') -- can be substituted for a variable to be more QUICKLY comprehendable, and eliminating the need for a comment, and eliminating the need for someone to have to Google the Moment.js library. I.e. let isTimeStampFromToday = moment().diff(entry.ts, 'days')
//I explain a little further directly in the code below.

//Other than those two things, I thought the readability of this file is mostly clear. Most properties and names are very clear to undestand without having to think too much about them. One small exception would be, 'ts', which stands for 'timestamp' as it took me a few moments to recognize this once I read farther down into the file.  
//I _might_ in order to eliminate assumptions, spell out this property as 'timestamp' but this is somewhat trivial in nature.
//Also the "Entry" interface could be more clear what exactly the entry is... maybe a comment or a more specific 
//name like, 'patientMetricEntry', but this is more trivial.

//When working on teams, code readability is crucial for
//other to easily digest and start being productive in someone else's code with
//minimal handoffs and instruction


import * as moment from 'moment';

interface Entry {
    id?: string;
    deleted?: boolean;
    value?: number;
    type?: string;
    status?: string;
    ts?: number;
}

interface EntryWrapper {
    data?: Entry[];
}

interface PatientResponseDataInterfaces {
    metrics: {
        temperature?: EntryWrapper;
        weight?: EntryWrapper;
        bloodpressure?: EntryWrapper;
    };
    ts: number;
}

class PatientModel {
    public recentMetrics: {
        bloodpressureLast?: EntryWrapper;
        bloodpressureToday?: EntryWrapper;
        temperatureLast?: EntryWrapper;
        temperatureToday?: EntryWrapper;
        weightLast?: EntryWrapper;
        weightToday?: EntryWrapper;
    } = {};

    private filterLatestReadings(
        overviewData: PatientResponseDataInterfaces[], 
        metric: string
    ): any {
        let readings = {};

        overviewData.forEach((day) => {
            let entry = day.metrics[metric];
            //FINELLI: improvement suggestion...
            //a few variables can really clean up these if statements...
            let metricToday = this.recentMetrics[`${metric}Today`]
            let metricLast = this.recentMetrics[`${metric}Last`]
            let readingToday = readings[`${metric}Today`]
            let readingLast = readings[`${metric}Today`]
            
            //FINELLI: EXAMPLE START>>
            // by variable-izing "this.recentMetrics[`${metric}Today`]" it makes for a much shorter line of code 
            //AND is easier to mentally digest
            // if (
            //     (this.recentMetrics[`${metric}Today`] && this.recentMetrics[`${metric}Last`]) ||
            //     (readings[`${metric}Today`] && readings[`${metric}Last`])) {
            //     return;
            // }
            //this if statement replaced the above if statement that is commented out...
            if (
                (metricToday && metricLast) ||
                (readingToday && readingLast)) {
                return;
            }
            //below this there are another 9-10 other examples that I did _not_ update, 
            //where these 4 short but expressive variables (metricToday, metricLast, readingToday, readingLast) can replace longer expressions
            //<<FINELLI: EXAMPLE END

            if (entry.data) {
                // Filter out deleted entries, and sort remaining by timestamp in descending order
                entry.data = entry.data.filter((entry) => (entry.status !== 'removed' && !entry.deleted));
                if (!entry.data.length) {
                    return;
                }
                entry.data.sort((entry1, entry2) => entry2.ts - entry1.ts);
                // Assign the last reading if today's exists already.
                if (readings[`${metric}Today`] && !readings[`${metric}Last`]) {
                    readings[`${metric}Last`] = entry.data[0];
                } else {
                    // Make sure reading was entered today, else save an empty object as today's reading
                    
                    //FINELLI: EXAMPLE START>>
                    //the following expression -- moment().diff(day.ts, 'days') -- can be substituted for a variable to be more 
                    //easily understood, and eliminating the need for a comment, and eliminating the need for someone to 
                    //have to Google the Moment.js library.
                    //For instance the following might be more clear to folks who are newer to the codebase or moment.js:
                    let isTimeStampFromToday = moment().diff(entry.ts, 'days') === 0; //(i would declare this at the top of the function, but leaving it here for clarity)
                    readings[`${metric}Today`] = (isTimeStampFromToday) ? entry.data[0] : {};
                  //readings[`${metric}Today`] = (moment().diff(entry.ts, 'days') === 0) ? entry.data[0] : {};
                    //<<FINELLI: EXAMPLE END
                }
                // If there are multiple entries, and today's reading has been assigned,
                // assign the second to last entry as the last reading
                if (entry.data[1] && readings[`${metric}Today`] && !readings[`${metric}Last`]) {
                    readings[`${metric}Last`] = entry.data[1];
                }
            } else {
                if (entry && entry.ts && !entry.deleted && entry.status !== 'removed') {
                    
                    //FINELLI: 
                    //I may substitute this moment function with a variable like "isThisOlderThanToday" as the expression below is somewhat confusing. Or at least add comments to explain.
                    if (moment().diff(day.ts, 'days') < 1) {
                        if (!readings[`${metric}Today`]) {
                            readings[`${metric}Today`] = entry;
                        }
                    } else {
                        if (!readings[`${metric}Last`]) {
                            readings[`${metric}Last`] = entry;
                        }
                    }
                }
            }
        });
        return readings;
    }

}
