
import config from './config.json';
import request from 'request-promise-native';
import Sakai from './Sakai';
import Brightspace from './Brightspace';

class App {
    static async main() {
        const sakai = new Sakai();
        const loginCookie = await sakai.getLoginCookie(config.sakai.userId, config.sakai.password);
        if (loginCookie) {
            const assignments = await sakai.getAssignments('40d71ec5-7710-4523-9678-698d25ccbe08', loginCookie)
            assignments.map(async (assignment) => {
                assignment.attachments = await sakai.getAssignmentAttachments(assignment, loginCookie);
            });
            console.log(`Retrieved information on ${assignments.length} Sakai assignments.`);
        }
        else {
            console.log("Could not retrieve assignments. Perhaps config.json is missing or has incorrect sakai.userId or sakai.password. Continuing...");
        }

        const brightspace = new Brightspace();
        const context = brightspace.contextFactory(config.brightspace.appId, config.brightspace.appKey,config.brightspace.userId, config.brightspace.userKey);

        const user = await brightspace.getUser(223,context);
        console.log(user);
    }
}

App.main();