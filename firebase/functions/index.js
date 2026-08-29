// Firebase Cloud Functions entry point.
exports.health = (_, response) => response.json({service:'GovPilot-X',status:'ok'});
