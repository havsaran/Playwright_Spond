import { test } from '@playwright/test';
import User from '../user.json'

// Spond Event Registeration
test.describe('Spond Event Registeration', { tag: '@Padel' }, () => {
    let token: string;

    test.beforeEach('Login', async ({ request }) => {

        const login_response = await request.post('https://api.spond.com/core/v1/login', {
            data: {
                email: User.email,
                //password: User.password
                password: process.env.password
            }
        })

        let login_responseBody = await login_response.json()
        token = `Bearer ${login_responseBody?.loginToken}`;

        console.log(JSON.stringify(await login_response.json(), null, 2))
    })


    test('TestCase 1: Padel- ', async ({ request }) => {
        test.setTimeout(180_000);

        let feb04_event = '92D27B6C6B274202944410790E441BFA'
        let feb05_event = '27954C11843B413582B5FD2BC4BCF674'
        let gameID_Biginner = '26014AD70AA6413796C2750E60E210A5'

        let month: number = 2;
        let date: number = 2;
        let time: number = 16;
        let mins: number = 59;
        let secs: number = 55;

        await waitForSpecificDateAndTime(2025, month, date, time, mins, secs, 100);

        console.log('Date and time matched! Running the test...');

        let eventID: string = feb05_event;

        //   userid padel
        let userID: string = 'F311B5174498469391A82951039D6421';

        //userid Bergen vest
        // let userID: string = '5BBDAD8114384676937242897F2A38D7'

        let actionURL: string = `https://api.spond.com/core/v1/sponds/${eventID}/responses/${userID}`

        let maxRetries = 20;
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
        }, 100); // Check every 100 milliseconds
    });
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
