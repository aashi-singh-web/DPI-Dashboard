function parseEngineOutput(stdout = "", stderr = "") {

    const start = stdout.indexOf("===JSON_START===");
    const end = stdout.indexOf("===JSON_END===");

    if (start === -1 || end === -1) {
        return {
            totalPackets: 0,
            tcpPackets: 0,
            udpPackets: 0,
            forwarded: 0,
            dropped: 0,
            applications: [],
            threads: [],
            domains: [],
            raw: {
                stdout,
                stderr
            }
        };
    }

    const jsonText = stdout
        .substring(start + "===JSON_START===".length, end)
        .trim();

    return JSON.parse(jsonText);
}

module.exports = {
    parseEngineOutput
};