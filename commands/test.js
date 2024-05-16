const db = require("../database");

const main = async () => {
    const res = await db.raw(`SELECT created_at from listing_approval_requests`);
    console.log(res)
    process.exit();
}

main();