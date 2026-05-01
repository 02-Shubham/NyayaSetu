const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Authorizing user's new login address as an Agency...");

    const addressesPath = path.join(__dirname, "../deployed-addresses.json");
    if (!fs.existsSync(addressesPath)) {
        console.error("deployed-addresses.json not found!");
        return;
    }
    const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
    const Registry = await hre.ethers.getContractAt("CivicChainRegistry", addresses.CivicChainRegistry);

    const agencyAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
    const department = "Cyber Crime"; // Assigned a default department

    console.log(`Adding ${agencyAddress} to department: ${department}`);
    
    // Using default signer (Admin/Deployer)
    const tx1 = await Registry.addAgency(agencyAddress, department);
    await tx1.wait();
    
    console.log(`✅ Successfully authorized ${agencyAddress} for ${department}!`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
