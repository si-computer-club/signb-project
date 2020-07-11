const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Bangkok');
moment.locale('th');

class Message {
  static askMenses(today = moment()) {
    return {
      "type": "flex",
      "altText": "สอบถามประจำเดือน กรุณาตอบในโทรศัพท์",
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "วันนี้คุณมีประจำเดือนหรือไม่",
              "size": "lg",
              "align": "start",
              "weight": "bold"
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "ไม่มี",
                "text": `วันที่ ${today.format('D/M/Y')} ไม่มีประจำเดือน`
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "มีเป็นจุด",
                "text": `วันที่ ${today.format('D/M/Y')} มีประจำเดือนเป็นจุด`
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "มีเล็กน้อย",
                "text": `วันที่ ${today.format('D/M/Y')} มีประจำเดือนเล็กน้อย`
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "มีเป็นปกติ",
                "text": `วันที่ ${today.format('D/M/Y')} มีประจำเดือนเป็นปกติ`
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "มีมากกว่าปกติ",
                "text": `วันที่ ${today.format('D/M/Y')} มีประจำเดือนมากกว่าปกติ`
              }
            }
          ]
        }
      }
    };
  }

  static confirmBirthdate(bd) {
    return {
      "type": "template",
      "altText": "confirm",
      "template": {
        "type": "confirm",
        "text": `วันเกิดของคุณคือ ${bd.format('วันddddที่ D MMMM YYYY')} ขณะนี้คุณอายุ ${moment().diff(bd, 'years')} ปี ถูกต้องไหมคะ`,
        "actions": [
          {
            "type": "message",
            "label": "ใช่",
            "text": "ใช่"
          },
          {
            "type": "message",
            "label": "ไม่ใช่",
            "text": "ไม่ใช่"
          }
        ]
      }
    }
  }
}

module.exports =  Message;