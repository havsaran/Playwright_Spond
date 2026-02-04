import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Spond Event Registeration
test.describe('Spond Event Registeration', { tag: '@Padel' }, () => {
    let token: string;

    test.beforeAll('Login', async ({ request }) => {
        const login_response = await request.post('https://api.spond.com/core/v1/login', {
            data: {
                email: process.env.EMAIL,
                password: process.env.PASS
            }
        })
        expect(login_response.status()).toEqual(200)

        let login_responseBody = await login_response.json()
        token = `Bearer ${login_responseBody?.loginToken}`;

        console.log(JSON.stringify(await login_response.json(), null, 2))
        console.log(`current time:  /n ${new Date()} /n`)
    })

    test('TestCase 1: padel_Wednesday', async ({ request }) => {
        test.setTimeout(600_000);

        let eventID: string = '538CFD696E2D40BF8E7F75955D073943'; //   userid padel
        let userID = process.env.PADEL_USERID;

        let month: number = 2;
        let date: number = 8;
        let time: number = 16;
        let mins: number = 0;
        let secs: number = 0;

        await waitForSpecificDateAndTime(2026, month, date, time, mins, secs, 50);

        console.log('Date and time matched! Running the test...');

        let actionURL: string = `https://api.spond.com/core/v1/sponds/${eventID}/responses/${userID}`

        let maxRetries = 68;
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
        }, 1000); // Check every 1 seconds
    });
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
