import { test } from '@playwright/test';
import * as fs from 'fs';

// Spond Event Registeration
test.describe('Spond Event Registeration', { tag: '@Padel' }, () => {
    let token: string;

    test.beforeAll('Login', async ({ request }) => {
        let email_ID = process.env.EMAIL
        let pass = process.env.PASSWORD

        const login_response = await request.post('https://api.spond.com/core/v1/login', {
            data: {
                email: email_ID,
                password: pass
            }
        })

        let login_responseBody = await login_response.json()
        token = `Bearer ${login_responseBody?.loginToken}`;

        console.log(JSON.stringify(await login_response.json(), null, 2))
        console.log(`current time:  /n ${new Date()} /n`)
    })


    test('TestCase 1: Padel- ', async ({ request }) => {
        test.setTimeout(30_000);

        let feb05_event = '27954C11843B413582B5FD2BC4BCF674'

        let month: number = 2;
        let date: number = 4;
        let time: number = 13;
        let mins: number = 8;
        let secs: number = 0;

        await waitForSpecificDateAndTime(2025, month, date, time, mins, secs, 50);

        console.log('Date and time matched! Running the test...');

        let eventID: string = feb05_event;

        //   userid padel
        let userID = process.env.PADEL_USERID;

        let actionURL: string = `https://api.spond.com/core/v1/sponds/${eventID}/responses/${userID}`

        let maxRetries = 65;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const action_response = await request.put(actionURL, {
                data: { "accepted": true },
                headers: {
                    authorization: token
                }
            },
            )
            console.log(`/n ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}: ${new Date().getMilliseconds()} /n`)

            const reponseBody = await action_response.json();

            if (action_response.status() === 200) {

                console.log(`Res status: ${action_response.status()} /n ResBody: ${JSON.stringify(await action_response.json(), null, 2)}`)
                break;
            }
            else {
                console.log(`Res status: ${action_response.status()}/n ResBody: ${reponseBody}`)
                await delay(1000); // waiting 1 sec
                console.log(` attempt: ${attempt}-time after 1 min delaying req:  /n ${new Date()} /n`)
            }
        }

        console.log(`/n ${new Date()} /n`)


    });

    // test('TestCase 2-dummy', async ({request}) => {
    //     console.log(`TestCase 2-dummy is running : /n`)
    //     console.log(`The time is: /n ${new Date()} /n`)

    // })
})



async function waitForSpecificDateAndTime(
    targetYear: number,
    targetMonth: number,
    targetDay: number,
    targetHour: number,
    targetMinute: number,
    targetSecond: number,
    targetMillisecond: number
): Promise<void> {
    const targetTime = new Date(targetYear, targetMonth - 1, targetDay, targetHour, targetMinute, targetSecond, targetMillisecond);
    const now = new Date();

    if (now >= targetTime) {
        console.log('Target time has already passed. Running the test immediately...');
        return; // Exit the function, allowing the test to continue immediately.
    }

    console.log(`Waiting until ${targetTime.toISOString()}...`);
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const current = new Date();
            if (current >= targetTime) {
                clearInterval(interval);
                resolve();
            }
        }, 100); // Check every 100 milliseconds
    });
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
