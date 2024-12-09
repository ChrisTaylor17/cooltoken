const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your token contract address
const abi = [
  // Replace with your contract's ABI
  {
    "inputs": [],
    "name": "mineToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let signer;
let contract;

async function connectWallet() {
  updateStatus("Connecting wallet...", "loading");

  if (!window.ethereum) {
    updateStatus("MetaMask is not installed. Please install it to use this site.", "error");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    // Enable the mining button
    document.getElementById("mineToken").disabled = false;
    document.getElementById("mineToken").classList.remove("hidden");
    updateStatus("Wallet connected! You can now mine tokens.", "success");
  } catch (error) {
    updateStatus("Error connecting wallet: " + error.message, "error");
  }
}

async function mineToken() {
  if (!contract) {
    updateStatus("Connect your wallet first.", "error");
    return;
  }

  try {
    updateStatus("Mining token...", "loading");
    const tx = await contract.mineToken();
    console.log("Transaction sent:", tx);
    await tx.wait();
    updateStatus("Token mined successfully!", "success");
  } catch (error) {
    console.error("Error mining token:", error);
    updateStatus("Error mining token: " + error.message, "error");
  }
}

function updateStatus(message, statusClass) {
  const statusElement = document.getElementById("status");
  statusElement.textContent = message;
  statusElement.className = 'hidden';  // Reset status class
  statusElement.classList.add(statusClass);
}

// Event Listeners
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("mineToken").addEventListener("click", mineToken);

