const fs = require('fs');
require('dotenv').config();

const API_URL = 'http://localhost:3002/api/compose';
const API_KEY = process.env.OPENROUTER_API_KEY;

const delay = ms => new Promise(res => setTimeout(res, ms));

async function runTest(name, payload) {
    console.log(`\n================================`);
    console.log(`Testing: ${name}`);
    console.log(`Payload:`, payload);
    console.log(`================================`);

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...payload,
                apiKey: API_KEY
            })
        });

        if (!res.ok) {
            console.error(`HTTP Error: ${res.status}`);
            console.error(await res.text());
            return;
        }

        const data = await res.json();
        console.log(`\n✅ Success! Validation Passed: ${data.validationPassed}`);
        console.log(`Meter Adherence: ${data.meterAdherence}%`);
        console.log(`Detected Rhyme Scheme: ${data.detectedRhymeScheme}`);
        console.log(`Explanation: ${data.explanation}\n`);

        console.log(`Poem:`);
        data.lines.forEach((l, i) => {
            console.log(`[${(i + 1).toString().padStart(2, ' ')}] ${l.syllables.toString().padStart(2, ' ')} syl | ${l.meterAdherence}% match | Rhyme: ${l.rhymeSound || ' '}(${l.rhymeWord}) | ${l.syllables.map(s => s.stress ? '/' : 'u').join(' ')}`);
        });
        console.log(`\nRAW TEXT:\n${data.lines.map(l => l.syllables.map(s => s.text).join('')).join('\n')}`);

    } catch (err) {
        console.error(`Failed to test ${name}:`, err);
    }
}

async function main() {
    await runTest('1. Trochaic Pentameter English Ode', {
        form: 'English Ode',
        meter: 'Trochaic',
        foot: 'Pentameter',
        theme: 'The dawn of a new era'
    });

    await delay(2000);

    await runTest('2. Anapestic Trimeter Madrigal', {
        form: 'Madrigal',
        meter: 'Anapestic',
        foot: 'Trimeter',
        theme: 'The sorrow of parting'
    });

    await delay(2000);

    await runTest('3. Dactylic Tetrameter Quatrain (Acrostic: Test)', {
        form: 'Quatrain',
        meter: 'Dactylic',
        foot: 'Tetrameter',
        theme: 'Testing the limits of time',
        acrostic: 'TEST'
    });
}

main();
