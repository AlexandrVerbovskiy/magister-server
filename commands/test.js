const db = require("../database");

const main = async () => {
    const res = await db.raw(`select * from "listing_approval_requests" where listing_approval_requests.created_at >= '2024-05-10 00:00:00' and listing_approval_requests.created_at <= '2024-05-10 23:59:59' and "listing_approval_requests"."approved" is null`);
    console.log(res.rows)
    process.exit();
}

main();