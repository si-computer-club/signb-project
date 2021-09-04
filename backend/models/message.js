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
      "altText": "สอบถามวันเกิด กรุณาตอบในโทรศัพท์",
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
  static askPainImage() {
    return {
      "imageUrl": "https://storage.googleapis.com/signb-project.appspot.com/painscale.jpg"
    }
  }
  static askPain(today = moment()) {
    return {
      "type": "flex",
      "altText": "สอบถามความเจ็บปวด กรุณาตอบในโทรศัพท์",
      "contents": {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "md",
          "action": {
            "type": "uri",
            "label": "Action",
            "uri": "https://linecorp.com"
          },
          "contents": [
            {
              "type": "text",
              "text": "คุณมีความปวดระดับใด",
              "size": "lg",
              "align": "start",
              "weight": "bold"
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "0",
                        "text": "0"
                      },
                      "color": "#B1E5A6",
                      "margin": "xs",
                      "style": "primary"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "1",
                        "text": "1"
                      },
                      "color": "#B1E5A6",
                      "margin": "xs",
                      "style": "primary"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "2",
                        "text": "2"
                      },
                      "color": "#B1E5A6",
                      "margin": "xs",
                      "style": "primary"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "3",
                        "text": "3"
                      },
                      "color": "#B1E5A6",
                      "margin": "xs",
                      "style": "primary"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "4",
                        "text": "4"
                      },
                      "color": "#FFE270",
                      "margin": "xs",
                      "style": "primary"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "5",
                        "text": "5"
                      },
                      "color": "#FFE270",
                      "margin": "xs",
                      "style": "primary"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "6",
                        "text": "6"
                      },
                      "color": "#FFE270",
                      "margin": "xs",
                      "style": "primary"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "7",
                        "text": "7"
                      },
                      "color": "#FFE270",
                      "margin": "xs",
                      "style": "primary"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "8",
                        "text": "8"
                      },
                      "color": "#E76F6F",
                      "margin": "xs",
                      "style": "primary"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "9",
                        "text": "9"
                      },
                      "color": "#E76F6F",
                      "margin": "xs",
                      "style": "primary"
                    },
                    {
                      "type": "button",
                      "action": {
                        "type": "message",
                        "label": "10",
                        "text": "10"
                      },
                      "color": "#E76F6F",
                      "margin": "xs",
                      "style": "primary"
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    };
  }

  static askDrug() {
    return {
      "type": "flex",
      "altText": "สอบถามประวัติยา กรุณาตอบในโทรศัพท์",
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "วันนี้คุณทาน/ใช้ยาตามที่แพทย์สั่งครบไหมคะ",
              "size": "lg",
              "align": "start",
              "weight": "regular",
              "wrap": true
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
                "label": "ครบ",
                "text": "ครบ"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "ไม่ครบ/ไม่ได้ทาน",
                "text": "ไม่ครบ"
              }
            }
          ]
        }
      }
    };
  }
}

module.exports =  Message;