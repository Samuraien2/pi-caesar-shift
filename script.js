/*
Pi Caesar Shift - https://github.com/Samuraien2/pi-caesar-shift
Just like the original caesar shift this uses a predefined ascii-like character map.
Only difference being that the original only contains letters.
This algorithm works by essentially applying a pi mask on top of all the letters.
The nth letter of the input will be shifted left/right by the nth letter of pi.

Uses PI calculation algorithm by Andrew Jennings
http://ajennings.net/blog/a-million-digits-of-pi-in-9-lines-of-javascript.html
*/

const piGenSrc = `
self.onmessage = e => {
    const digits = BigInt(e.data);
    let i = 1n;
    let x = 3n * (10n ** (digits + 19n));
    let pi = x;
    while (x > 0) {
        x = x * i / ((i + 1n) * 4n);
        pi += x / (i + 2n);
        i += 2n;
    }
    self.postMessage("" + pi / (10n ** 20n));
}`;

const piGen = new Worker(URL.createObjectURL(
    new Blob([piGenSrc], { type: "application/javascript" })
));
piGen.onmessage = e => pi = e.data;
piGen.postMessage(10000);

const characterMap = "!\"$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ [\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

let pi = Math.PI.toString();

// expands / shrinks textarea to fit the amount of lines in the textarea
function fitTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

const encryptInput = document.getElementById("encrypt-in");
const encryptOutput = document.getElementById("encrypt-out");
const decryptInput = document.getElementById("decrypt-in");
const decryptOutput = document.getElementById("decrypt-out");

// shifts every character in a string by each PI digit
function piCaesarShift(input, reversed) {
    let output = "";
    for (let i = 0; i < input.length; i++) {
        const ch = input.charAt(i);
        const index = characterMap.indexOf(ch);
        // if character is in the character map
        if (index != -1) {
            const piDigit = parseInt(pi.charAt(i));
            const code = reversed ? (index - piDigit) : (index + piDigit);
            const newIndex = wrapMod(code, characterMap.length);
            output += characterMap.charAt(newIndex);
        } else {
            output += ch;
        }
    }
    return output;
}

const ENCRYPT = false;
const DECRYPT = true;

function encrypt() {
    encryptOutput.value = piCaesarShift(encryptInput.value, ENCRYPT);
    fitTextarea(encryptInput);
    fitTextarea(encryptOutput);
}

function decrypt() {
    decryptOutput.value = piCaesarShift(decryptInput.value, DECRYPT);
    fitTextarea(decryptInput);
    fitTextarea(decryptOutput);
}

// modulus operator, but if it goes in negative it wraps around, why is this not default javascript :(
const wrapMod = (n, m) => ((n % m) + m) % m;

encryptInput.addEventListener('input', encrypt);
decryptInput.addEventListener('input', decrypt);