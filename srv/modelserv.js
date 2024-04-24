const cds = require('@sap/cds');
const fs = require('fs');
const { exec,spawn } = require('child_process'); // Add require statement for child_process

module.exports = cds.service.impl((srv) => {
    srv.on('appendTextToFile', async (req) => {
        try {
            // Read the value of "content" from the request body
            const data = req.data.content;

            // Provide the correct file path
            const filePath = '/home/user/projects/Pfe/ClientProject/db/schema.cds';
       
            // Write the value of "content" to the file
            await fs.promises.writeFile(filePath, data + '\n');

            console.log('Data written to file successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error writing data to file:', error);
            return { success: false };
        }
    });
    srv.on('appendServiceToFile', async (req) => {
        try {
            // Read the value of "content" from the request body
            const data = req.data.content;

            // Provide the correct file path
            const filePath = '/home/user/projects/Pfe/App_Generator/db/src/schema.cds';
       
            // Write the value of "content" to the file
            await fs.promises.writeFile(filePath, data + '\n');

            console.log('Data written to file successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error writing data to file:', error);
            return { success: false };
        }
    });

    srv.on('ExecuteCommand', async (req) => {
        const { command } = req.data;
        

        try {
            // Execute the terminal command
            const output = await executeTerminalCommand(command);
            return { result: output };
        } catch (error) {
            console.error('Error executing command:', error);
            return error;
        }
    });
   
});

async function executeTerminalCommand(command) {
    return new Promise((resolve, reject) => {
        // Lancer la commande dans un nouveau shell
        const process = spawn(command, {
            shell: true, // Utiliser le shell pour interpréter la commande
            stdio: 'inherit' // Hériter les stdio pour voir les sorties dans le terminal BAS
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log('Command executed successfully');
                resolve(true);
            } else {
                console.error(`Command failed with exit code ${code}`);
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });

        process.on('error', (error) => {
            console.error('Failed to start subprocess.');
            reject(error);
        });
    });
}