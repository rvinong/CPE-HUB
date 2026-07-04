const { profileFetch } = require("../server/supabase/handlers");
const { nodeHandler } = require("../server/supabase/nodeHandler");

module.exports = nodeHandler(profileFetch);
