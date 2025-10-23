// if this was an actual encryption task i would just use an actual encryption algorithm
// but since its just for fun this will do.. :)
// introducing... the: PI CAESAR SHIFT!!!!

const includedLetters = "!\"$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ [\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

let piDigits = null;

async function getPiDigits() {
    const response = await fetch('https://api.pi.delivery/v1/pi?start=0&numberOfDigits=1000');
    const data = await response.json();
    return data.content;
}

getPiDigits().then(digits => {
    piDigits = digits;
    if (encryptInput.value) {
        encrypt();
    }
    if (decryptInput.value) {
        decrypt();
    }
})

// expands / shrinks textarea to fit the amount of lines in the textarea
function fitTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

const encryptInput = document.getElementById("encrypt-in");
const encryptOutput = document.getElementById("encrypt-out");
const decryptInput = document.getElementById("decrypt-in");
const decryptOutput = document.getElementById("decrypt-out");

// yes it would probably be a better practice and more modular to create a function for encrypt and decrypt...
// but i dont want to

function encrypt() {
    const input = encryptInput.value;
    let output = "";

    for (let i = 0; i < input.length; i++) {
        const ch = input.charAt(i);

        let index = includedLetters.indexOf(ch);
        if (index != -1) {
            const code = (index + parseInt(piDigits.charAt(i))) % includedLetters.length;
            output += includedLetters.charAt(code);
        } else {
            output += ch;
        }
    }

    encryptOutput.value = output;
    fitTextarea(encryptInput);
    fitTextarea(encryptOutput);
}

function wrapMod(n, m) {
    return ((n % m) + m) % m;
}

function decrypt() {
    const input = decryptInput.value;
    let output = "";

    for (let i = 0; i < input.length; i++) {
        let ch = input.charAt(i);
        let index = includedLetters.indexOf(ch);
        if (index != -1) {
            const code = wrapMod(index - parseInt(piDigits.charAt(i)), includedLetters.length);
            output += includedLetters.charAt(code);
        } else {
            output += ch;
        }
    }

    decryptOutput.value = output;
    fitTextarea(decryptInput);
    fitTextarea(decryptOutput);
}

encryptInput.addEventListener('input', encrypt);
decryptInput.addEventListener('input', decrypt);