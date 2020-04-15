# SI-GyneBot
### Welcome to signb-project repository
This is a main reposity for Siriraj Computer Club gynecology chatbot project. Primary goal of this project is to create a chatbot capable of recording user menstual cycle data as well as a webapp capable of providing user data to clinician upon requesting and approval from patient.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (LTS version is recommended)
- [npm](https://www.npmjs.com/)
- [Google Cloud](https://cloud.google.com/) account (Gmail account)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts)
- [ngrok](https://ngrok.com/)

### Installation
1. Make sure all the prerequisites are installed.
1. [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo#step-2-create-a-local-clone-of-your-fork) this repo.
1. [Clone](https://help.github.com/en/github/getting-started-with-github/fork-a-repo#step-2-create-a-local-clone-of-your-fork) your forked repository into your local computer.
1. Run `npm install` in your clone folder.

### Get the User Role and Permission in Google Cloud Platform
1. Contact [our group](https://github.com/SiComputorClub) or [me](https://github.com/jewkub) to get permission for using database.
1. Create Google Cloud [Service Account](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) and download to your project folder inside `/secret/` folder (or any folder that will not be committed).
1. Set the [environment variable](https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable) every time before run server.
1. (Optional) You can use [shortcut](https://superuser.com/a/1276344) to predefine the environment variable (for example, my shortcut script in `Target` field is: `C:\Windows\System32\cmd.exe /k "set GOOGLE_APPLICATION_CREDENTIALS=.\secret\[MY SERVICE ACCOUNT FILE].json&&cd [MY PROJECT FOLDER]"`) and set to always run as administrator.

### Test server in your local machine
1. Setup ngrok. Maybe this [tutorial](https://medium.com/linedevth/linebot-ngrok-b319841a49d7) will help. (__In 'section 2. ngrok' only, skip the LINE webhook section__, as we will set dialogflow webhook instead)
1. Point Dialogflow Fulfillment webhook URL to your tunnel URL, append `/webhook`.
1. `npm run dev`.
1. Don't forget to change webhook back to original URL. (Should be like: `https://signb-project.appspot.com/webhook`)

### Build pages and deploy for production usage
1. `npm run build`.
1. `npm run deploy`, `y`.

### Here is a brief description of main files/folders in this repository
- `package.json` is the JSON file that contain configurations of our project, such as script commands and dependency lists.
- `server.js` file is the main logic of this project. It runs when the server start, as described in `package.json`.
- `routes/` folder containing route files is used to manage every http requests that come to the server.
- `routes/webhook.js` file handle POST requests that come to '/webhook'.
- `intents/intent.js` file manage response for matched intents.
- `pages/` is default folder to serve [React](https://reactjs.org/) page, as we use [Next.js](https://reactjs.org/) framework.

## Contribute to project

### For those who never use github
Please refer to **Getting started with github** for more information on setting up your github account and creating your first commit.

### For those who have used github before
To contribute to this project you can make a change in code at anytime given that you are not directly commit to master branch 

*A direction to create new branch can be found in __[https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository#creating-a-branch](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository#creating-a-branch)__ or you can select "Create a new branch for this commit and start a pull request." when you commit a change*

*If you are not understand any word regarding git workflow in an above paragraph please refer to a tutorial link given in a __Getting started with github__ section below*


## Getting start with github
First you would need to go to [github](https://github.com/) and create your account by following any instruction it give.

Next if you want to use git your computer I would recommend installing git ([https://git-scm.com/downloads](https://git-scm.com/downloads)). 

Then I would suggest following [This tutorial](https://guides.github.com/activities/hello-world/) to get a basic understanding of git workflow.

More information can be found in **[https://help.github.com/en/github/getting-started-with-github](https://help.github.com/en/github/getting-started-with-github)**

## License
MIT - see [details](https://github.com/jewkub/signb-project/blob/master/LICENSE)