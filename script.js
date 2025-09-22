// Navigation and Page Management
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Navigation link handling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
            
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
});

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('fade-in');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Update URL hash
    window.location.hash = pageId;
}

// Handle browser back/forward
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    } else {
        showPage('home');
    }
});

// Initialize page on load
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    } else {
        showPage('home');
    }
});

// Utility Functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.select();
        document.execCommand('copy');
        showMessage('Text copied to clipboard!', 'success');
    }
}

function showMessage(text, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at the top of the current page
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const container = activePage.querySelector('.container');
        if (container) {
            container.insertBefore(message, container.firstChild);
        }
    }
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Caesar Cipher Functions
function caesarEncrypt() {
    const text = document.getElementById('caesar-text').value;
    const shift = parseInt(document.getElementById('caesar-shift').value) || 3;
    
    if (!text.trim()) {
        showMessage('Please enter text to encrypt', 'error');
        return;
    }
    
    const result = caesarCipher(text, shift);
    document.getElementById('caesar-result').value = result;
}

function caesarDecrypt() {
    const text = document.getElementById('caesar-text').value;
    const shift = parseInt(document.getElementById('caesar-shift').value) || 3;
    
    if (!text.trim()) {
        showMessage('Please enter text to decrypt', 'error');
        return;
    }
    
    const result = caesarCipher(text, -shift);
    document.getElementById('caesar-result').value = result;
}

function caesarCipher(text, shift) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + shift + 26) % 26) + base);
        }
        return char;
    }).join('');
}

function clearCaesar() {
    document.getElementById('caesar-text').value = '';
    document.getElementById('caesar-result').value = '';
    document.getElementById('caesar-shift').value = '3';
}

// Transposition Cipher Functions
function transpositionEncrypt() {
    const text = document.getElementById('trans-text').value;
    const key = document.getElementById('trans-key').value;
    
    if (!text.trim() || !key.trim()) {
        showMessage('Please enter both text and key', 'error');
        return;
    }
    
    const result = columnarTranspositionEncrypt(text, key);
    document.getElementById('trans-result').value = result;
}

function transpositionDecrypt() {
    const text = document.getElementById('trans-text').value;
    const key = document.getElementById('trans-key').value;
    
    if (!text.trim() || !key.trim()) {
        showMessage('Please enter both text and key', 'error');
        return;
    }
    
    const result = columnarTranspositionDecrypt(text, key);
    document.getElementById('trans-result').value = result;
}

function columnarTranspositionEncrypt(text, key) {
    // Remove spaces and convert to uppercase
    text = text.replace(/\s/g, '').toUpperCase();
    key = key.toUpperCase();
    
    // Create column order based on alphabetical order of key
    const keyOrder = key.split('').map((char, index) => ({ char, index }))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map((item, newIndex) => ({ ...item, newIndex }))
        .sort((a, b) => a.index - b.index)
        .map(item => item.newIndex);
    
    // Create grid
    const numCols = key.length;
    const numRows = Math.ceil(text.length / numCols);
    const grid = [];
    
    for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
            const charIndex = i * numCols + j;
            grid[i][j] = charIndex < text.length ? text[charIndex] : 'X';
        }
    }
    
    // Read columns in key order
    let result = '';
    for (let col = 0; col < numCols; col++) {
        const actualCol = keyOrder.indexOf(col);
        for (let row = 0; row < numRows; row++) {
            result += grid[row][actualCol];
        }
    }
    
    return result;
}

function columnarTranspositionDecrypt(text, key) {
    key = key.toUpperCase();
    const numCols = key.length;
    const numRows = Math.ceil(text.length / numCols);
    
    // Create column order
    const keyOrder = key.split('').map((char, index) => ({ char, index }))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map((item, newIndex) => ({ ...item, newIndex }))
        .sort((a, b) => a.index - b.index)
        .map(item => item.newIndex);
    
    // Create grid
    const grid = Array(numRows).fill().map(() => Array(numCols).fill(''));
    
    // Fill grid column by column in key order
    let textIndex = 0;
    for (let col = 0; col < numCols; col++) {
        const actualCol = keyOrder.indexOf(col);
        for (let row = 0; row < numRows; row++) {
            if (textIndex < text.length) {
                grid[row][actualCol] = text[textIndex++];
            }
        }
    }
    
    // Read row by row
    let result = '';
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            result += grid[row][col];
        }
    }
    
    return result.replace(/X+$/, ''); // Remove padding
}

function clearTransposition() {
    document.getElementById('trans-text').value = '';
    document.getElementById('trans-result').value = '';
    document.getElementById('trans-key').value = 'SECRET';
}

// Vigenère Cipher Functions
function vigenereEncrypt() {
    const text = document.getElementById('vigenere-text').value;
    const key = document.getElementById('vigenere-key').value;
    
    if (!text.trim() || !key.trim()) {
        showMessage('Please enter both text and keyword', 'error');
        return;
    }
    
    const result = vigenereCipher(text, key, true);
    document.getElementById('vigenere-result').value = result;
}

function vigenereDecrypt() {
    const text = document.getElementById('vigenere-text').value;
    const key = document.getElementById('vigenere-key').value;
    
    if (!text.trim() || !key.trim()) {
        showMessage('Please enter both text and keyword', 'error');
        return;
    }
    
    const result = vigenereCipher(text, key, false);
    document.getElementById('vigenere-result').value = result;
}

function vigenereCipher(text, key, encrypt) {
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char.match(/[a-zA-Z]/)) {
            const isUpperCase = char === char.toUpperCase();
            const charCode = char.toUpperCase().charCodeAt(0) - 65;
            const keyChar = key[keyIndex % key.length].charCodeAt(0) - 65;
            
            let newCharCode;
            if (encrypt) {
                newCharCode = (charCode + keyChar) % 26;
            } else {
                newCharCode = (charCode - keyChar + 26) % 26;
            }
            
            let newChar = String.fromCharCode(newCharCode + 65);
            if (!isUpperCase) {
                newChar = newChar.toLowerCase();
            }
            
            result += newChar;
            keyIndex++;
        } else {
            result += char;
        }
    }
    
    return result;
}

function clearVigenere() {
    document.getElementById('vigenere-text').value = '';
    document.getElementById('vigenere-result').value = '';
    document.getElementById('vigenere-key').value = 'KEYWORD';
}

// Steganography Functions
let originalImageData = null;

function showStegoTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.stego-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function loadImage(input) {
    const file = input.files[0];
    if (!file) return;
    
    const fileInfo = document.getElementById('file-info');
    fileInfo.innerHTML = `
        <strong>File:</strong> ${file.name}<br>
        <strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB<br>
        <strong>Type:</strong> ${file.type}
    `;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('stego-canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'block';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function hideMessage() {
    const message = document.getElementById('secret-message').value;
    const password = document.getElementById('stego-password').value;
    
    if (!originalImageData) {
        showMessage('Please select an image first', 'error');
        return;
    }
    
    if (!message.trim()) {
        showMessage('Please enter a message to hide', 'error');
        return;
    }
    
    if (!password.trim()) {
        showMessage('Please enter a password', 'error');
        return;
    }
    
    // Encrypt message with password
    const encryptedMessage = simpleEncrypt(message, password);
    
    // Add delimiter to mark end of message
    const messageWithDelimiter = encryptedMessage + '###END###';
    
    const canvas = document.getElementById('stego-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(originalImageData);
    
    // Copy original image data
    for (let i = 0; i < originalImageData.data.length; i++) {
        imageData.data[i] = originalImageData.data[i];
    }
    
    // Hide message in LSB of red channel
    const messageBinary = stringToBinary(messageWithDelimiter);
    
    if (messageBinary.length > imageData.data.length / 4) {
        showMessage('Message too long for this image', 'error');
        return;
    }
    
    for (let i = 0; i < messageBinary.length; i++) {
        const pixelIndex = i * 4; // Red channel of each pixel
        const bit = parseInt(messageBinary[i]);
        
        // Modify LSB of red channel
        imageData.data[pixelIndex] = (imageData.data[pixelIndex] & 0xFE) | bit;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    document.getElementById('download-section').style.display = 'block';
    showMessage('Message hidden successfully!', 'success');
}

function loadExtractImage(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Store image data for extraction
            window.extractImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function extractMessage() {
    const password = document.getElementById('extract-password').value;
    
    if (!window.extractImageData) {
        showMessage('Please select an image first', 'error');
        return;
    }
    
    if (!password.trim()) {
        showMessage('Please enter the password', 'error');
        return;
    }
    
    const imageData = window.extractImageData;
    let binaryMessage = '';
    
    // Extract bits from LSB of red channel
    for (let i = 0; i < imageData.data.length; i += 4) {
        const bit = imageData.data[i] & 1;
        binaryMessage += bit;
    }
    
    // Convert binary to string
    const extractedText = binaryToString(binaryMessage);
    
    // Find the delimiter
    const delimiterIndex = extractedText.indexOf('###END###');
    if (delimiterIndex === -1) {
        showMessage('No hidden message found or wrong password', 'error');
        return;
    }
    
    const encryptedMessage = extractedText.substring(0, delimiterIndex);
    
    try {
        // Decrypt message
        const decryptedMessage = simpleDecrypt(encryptedMessage, password);
        document.getElementById('extracted-message').value = decryptedMessage;
        showMessage('Message extracted successfully!', 'success');
    } catch (error) {
        showMessage('Wrong password or corrupted message', 'error');
    }
}

function downloadImage() {
    const canvas = document.getElementById('stego-canvas');
    const link = document.createElement('a');
    link.download = 'hidden_message.png';
    link.href = canvas.toDataURL();
    link.click();
}

function clearSteganography() {
    document.getElementById('stego-image').value = '';
    document.getElementById('secret-message').value = '';
    document.getElementById('stego-password').value = '';
    document.getElementById('file-info').innerHTML = '';
    document.getElementById('stego-canvas').style.display = 'none';
    document.getElementById('download-section').style.display = 'none';
    originalImageData = null;
}

function clearExtraction() {
    document.getElementById('extract-image').value = '';
    document.getElementById('extract-password').value = '';
    document.getElementById('extracted-message').value = '';
    window.extractImageData = null;
}

// Utility functions for steganography
function stringToBinary(str) {
    return str.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
}

function binaryToString(binary) {
    let result = '';
    for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.substr(i, 8);
        if (byte.length === 8) {
            const charCode = parseInt(byte, 2);
            if (charCode === 0) break; // Null terminator
            result += String.fromCharCode(charCode);
        }
    }
    return result;
}

function simpleEncrypt(text, password) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const textChar = text.charCodeAt(i);
        const keyChar = password.charCodeAt(i % password.length);
        result += String.fromCharCode(textChar ^ keyChar);
    }
    return btoa(result); // Base64 encode
}

function simpleDecrypt(encryptedText, password) {
    const decoded = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
        const encryptedChar = decoded.charCodeAt(i);
        const keyChar = password.charCodeAt(i % password.length);
        result += String.fromCharCode(encryptedChar ^ keyChar);
    }
    return result;
}