# SI-GyneBot
### Welcome to signb-project repository
This is a main repository for Siriraj Computer Club gynecology chatbot project. Primary goal of this project is to create a chatbot capable of recording user menstual cycle data as well as a webapp capable of providing user data to clinician upon requesting and approval from patient.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (LTS version is recommended) (โหลดตาม step ในเว็บเค้าเลย)
- [npm](https://www.npmjs.com/) (อันนี้รู้สึกว่ามันจะมากับ Node.js แล้วนะ ถ้าไม่ชัวร์ลอง npm --version ถ้ามันขึ้นเวอร์ชั่นมาคือใช้ได้)
- [Google Cloud](https://cloud.google.com/) account (Gmail account) (inviteไปละ)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts) (ถ้า invite ไปแล้วจะติดตั้งอันนี้ได้)
- [ngrok](https://ngrok.com/) (โหลดตาม step ในเว็บเค้าเลย)

### Installation
1. Make sure all the prerequisites are installed.
1. [Set up Git](https://help.github.com/en/github/getting-started-with-github/set-up-git). (ตามลิ้งเลยมั้ง//จมด)
1. [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo#step-2-create-a-local-clone-of-your-fork) this repo and clone into your local computer.(พิจอจิวแนะนำให้ใช้ visual studio code เปนตัว editor อ่ะ มันมีฟังก์ชั่นของ github ให้เสร็จสรรพเลยเว่ยแกรร) 
1. Run `npm install` in your clone folder. (เข้าไปรันใน cmd นะ cd ตามด้วยที่อยู่ของมัน)

### Get the User Role and Permission in Google Cloud Platform
1. Contact [our group](https://github.com/SiComputorClub) or [me](https://github.com/jewkub) to get permission for using database. (inviteไปละ สรุปคือมี invite 3 อัน google platform, project github, line administrator อะไรสักอย่าง)
1. Create Google Cloud [Service Account](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) and download to your project folder inside `/secret/` folder (or any folder that will __not__ be committed). (มันจะได้มาเป็นไฟล์.json เก็บไว้ในfolderในโปรเจ็คที่ชื่อ secretอ่ะ)
1. Set the [environment variable](https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable) every time before run server.(ไปใน cmd แล้วพิมพ์ set GOOGLE_APPLICATION_CREDENTIALS=ใส่ที่อยู่ของไฟล์เมื่อกี้)
1. (Optional) You can use [shortcut](https://superuser.com/a/1276344) to predefine the environment variable (for example, my shortcut script in `Target` field is: `C:\Windows\System32\cmd.exe /k "set GOOGLE_APPLICATION_CREDENTIALS=.\secret\[MY SERVICE ACCOUNT FILE].json&&cd [MY PROJECT FOLDER]"`) and set to always run as administrator. (ไม่รุ้ ยังไม่เคยลอง555)

### Test server in your local machine
ของเรา http 8080 นะจ้ะเพิ่ลๆ
1. Setup ngrok. Maybe this [tutorial](https://medium.com/linedevth/linebot-ngrok-b319841a49d7) will help. (__In 'section 2. ngrok' only, skip the LINE webhook section__, as we will set dialogflow webhook instead) (ngrok แล้วพิมพ์
1. Point Dialogflow Fulfillment webhook URL to your tunnel URL, append `/webhook/dialogflow` (Example: `https://aaaa1111.ngrok.io/webhook/dialogflow`).
1. (Optional, not necessary right now) Point LINE webhook URL to your tunnel URL, append `/webhook/line` (Example: `https://aaaa1111.ngrok.io/webhook/line`).
1. create new file `secret/secret.json`, mimic the template in `secret/secret.json.example` and edit token to the real one.
1. `npm run dev`.
1. Don't forget to change webhook back to original URL. (Should be like: `https://signb-project.appspot.com/webhook/dialogflow`)

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

## License
MIT - see [details](https://github.com/si-computer-club/signb-project/blob/master/LICENSE)
