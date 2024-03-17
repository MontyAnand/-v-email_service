# @v/email_service_wrapper
## Description
`@v/email_service_wrapper` is the wrapper over popular npm module __nodemailer__. The module provides easy to use APIs to configure SMTP gmail server and send mails using javascript event driven architecture without blocking main thread execution. The first version of this module supports only for gmail service i.e., the sender's mail should belongs to @gmail.com. To make the procedure easy and more secure this module takes App Password of gmail account generated after 2 step varification.  

## Method to generate password
![](Screenshot(110).png)

![](Screenshot(111).png)

![](Screenshot(112).png)
## Installation
```bash
npm install email_service
```
## Usage
``` javascript
  const { EmailService , EventHandler} = require("@vivek_kumar_/email_service_wrapper");

  EventHandler.on('success',(emailIdList)=>{
  console.log("Successfully sent to ",emailIdList);
  });

  EventHandler.on('fail',(data)=>{
  console.log("failed email :",data);
  });

  config = {
  emailId : "abc@gmail.com",
  passkey : "abcd efgh ijkl mnop"
  }
  const emailservice = new EmailService(config);
  const emailInfo = {
    to : "xyz@gmail.com pqr@gmail.com",
    subject : "message from email_service_wrapper",
    src_path : "path/to/your/html/file/to/send/as/body/of/email",
    attached_files :[
      {
        filename : "abc.jpeg",
        path: "path/to/abc.jpeg"
      },
      {
        filename: "xyz.pdf",
        path : "path/to/xyz/pdf"
      }
    ]
}
  emailservice.sendMail(emailInfo);

```

## APIs
`EmailService.sendMail`

Syntax : emailservice.sendMail(emailInfo);


Here __emailInfo__ is javascript object which contains following keys.


emailInfo {


  to,

  
  subject,

  
  html,

  
  text,

  
  src_path,

  
  attached_files

  
}


to: list of recipients in a single string seperated by " " e.g., 


to:  "abc@gmail.com xyz@outlook.com",


suject: Subject of the mail in string format. e.g., 


subject: "Mail sent from email_service_wrapper",

(html,text) : String/stream format of email body e.g.,

html: "Body of the mail",


src_path: path of the file that you want to show as the body of the mail. e.g.,

src_path : path/to/file


attached_files : list of javacript object that take filename displayed to recipient and path of the attachment file. e.g.,

attached_files :



    
    [
      {
        
        filename : "abc.jpeg",
        
        path: "path/to/abc.jpeg"
        
      },
      
      {
      
        filename: "xyz.pdf",
        
        path : "path/to/xyz/pdf"
        
      }
      
    ]
    

NOTE: In emailInfo object, if you are passing src_path then no need to pass the html and text explicitly.

## EVENTS
This module implements all important functions via events and __EventHandler__ event exports to the user program to customize the logic as per need other than default functionality.

EventHandler.on('prepare_data') : this event actually formats the information which is passed through the __EmailService.sendMail()__. You can redefine this event as per your business logic otherwise default function does all the formatting and file handling.

Eventhandler.on('send') : This events handles the procedure to send mail and responses accordingly on success or failure of sending mail process by emitting events __'success'__ , __'reject'__ or __'fail'__ .

# Contributing
Contributions are welcome and encouraged! Please feel free to submit pull requests, create issues, or suggest new features.
