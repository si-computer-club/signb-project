# SI-GyneBot
### Welcome to signb-project reposity
This is a main reposity for Siriraj Computer Club gynecology chatbot project. Primary target of this project is to create a chatbot capable of recording user menstual cycle data as well as a webapp capable of returning user data to clinician upon requesting and approval from patient.

## Contribute to project
### For those who never use github 
Please refer to **Getting start with github** for more information on setting up your github account and creating your first commit.

### For those who have used github before
To contribute to this project you can make a change in code at anytime given that you are not directly commit to master branch 

*A direction to create new branch can be found in __[https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository#creating-a-branch](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository#creating-a-branch)__ or you can select "Create a new branch for this commit and start a pull request." when you commit a change*

*If you are not understand any word regarding git workflow in an above paragraph please refer to a tutorial link given in a __Getting started with github__ section below*

### Here is a brief description of main files/folders in this repository
- `package.json` is the JSON file that contain configurations of our project, such as script commands and dependency lists.
- `server.js` file is the main logic of this project. It runs when the server start, as described in `package.json`.
- `routes/` folder containing route files is used to manage every http requests that come to the server.
- `routes/webhook.js` file handle POST requests that come to '/webhook'.
- `intents/intent.js` file manage response for matched intents.


## Getting start with github
First you would need to go to [github](https://github.com/) and create your account by following any instruction it give.

Next if you want to use git your computer I would recommend installing git ([https://git-scm.com/downloads](https://git-scm.com/downloads)). 

Then I would suggest following [This tutorial](https://guides.github.com/activities/hello-world/) to get a basic understanding of git workflow.

More information can be found in **[https://help.github.com/en/github/getting-started-with-github](https://help.github.com/en/github/getting-started-with-github)**
